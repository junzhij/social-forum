const express = require('express');
const router = express.Router();
const { Post, User, Comment, PostLike } = require('../models');
const jwt = require('jsonwebtoken');
const { authJwt } = require('../middleware');
const posts = require('../controllers/post.controller.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';  // 使用环境变量或后备值

// 验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  try {
    console.log('验证令牌:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('解码结果:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('令牌验证失败:', {
      error,
      token,
      secret: JWT_SECRET
    });
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

// 获取帖子详情
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      attributes: [
        'id',
        'content',
        'likes',
        'commentCount',
        'authorId',
        'image',
        'hasImage',
        'isAnonymous',
        ['_create', 'createdAt'],
        ['_update', 'updatedAt']
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'author'
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['username'],
            as: 'author'
          }]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    // 转换为纯 JSON 对象，并确保点赞数有默认值 0
    const result = post.toJSON();
    result.likes = result.likes || 0;
    // 如果是匿名帖子，隐藏作者信息
    if (result.isAnonymous) {
      result.author = null;
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    res.status(500).json({ message: '获取帖子失败' });
  }
});

// 获取帖子评论
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { contentId: req.params.id },
      include: [{
        model: User,
        attributes: ['username'],
        as: 'author'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ message: '获取评论失败' });
  }
});

// 添加评论
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        message: '评论内容不能为空'
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      contentId: req.params.id,
      authorId: req.user.id
    });
    
    // 更新帖子的评论数
    await Post.increment('commentCount', {
      where: { id: req.params.id }
    });
    
    // 获取包含用户信息的完整评论数据
    const newComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['username'],
        as: 'author'
      }]
    });
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('发表评论失败:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: '评论内容格式不正确' });
    } else {
      res.status(500).json({ message: '发表评论失败' });
    }
  }
});

// 发帖路由
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: '内容不能为空'
      });
    }
    
    const userId = req.user.id;
    
    const post = await Post.create({
      content,
      isAnonymous: isAnonymous || false,
      authorId: userId
    });
    
    // 获取完整的帖子信息，包括作者
    const newPost = await Post.findOne({
      where: { id: post.id },
      attributes: [
        'id',
        'content',
        'likes',
        'commentCount',
        'authorId',
        'image',
        'hasImage',
        'isAnonymous',
        ['_create', 'createdAt'],
        ['_update', 'updatedAt']
      ],
      include: [{
        model: User,
        attributes: ['username'],
        as: 'author'
      }]
    });
    
    // 处理匿名帖子
    const postData = newPost.toJSON();
    if (postData.isAnonymous) {
      postData.author = null;
    }
    
    res.json(postData);
    
  } catch (error) {
    console.error('发帖失败:', error);
    res.status(500).json({
      message: '发帖失败'
    });
  }
});

// 获取帖子列表
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'content',
        'likes',
        'commentCount',
        'authorId',
        'image',
        'hasImage',
        'isAnonymous',
        ['_create', 'createdAt'],
        ['_update', 'updatedAt']
      ],
      include: [{
        model: User,
        attributes: ['username'],
        as: 'author'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    // 处理匿名帖子
    const processedPosts = posts.map(post => {
      const postData = post.toJSON();
      if (postData.isAnonymous) {
        postData.author = null;
      }
      return postData;
    });
    
    res.json(processedPosts);
  } catch (error) {
    console.error('获取帖子失败:', error);
    res.status(500).json({ message: '获取帖子失败' });
  }
});

// 点赞路由
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const userId = req.user.id;
    const liked = await PostLike.findOne({
      where: { UserId: userId, PostId: post.id }
    });

    if (liked) {
      // 取消点赞
      await liked.destroy();
      await post.decrement('likes');
      res.json({ liked: false, likes: post.likes - 1 });
    } else {
      // 添加点赞
      await PostLike.create({ UserId: userId, PostId: post.id });
      await post.increment('likes');
      res.json({ liked: true, likes: post.likes + 1 });
    }
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

// 获取点赞状态
router.get('/:id/like', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const liked = await PostLike.findOne({
      where: { UserId: userId, PostId: req.params.id }
    });
    res.json({ liked: !!liked });
  } catch (error) {
    res.status(500).json({ message: '获取点赞状态失败', error: error.message });
  }
});

// 获取用户的帖子
router.get('/users/:userId/posts', [authJwt.verifyToken], posts.getUserPosts);

// 删除帖子
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id  // 确保只能删除自己的帖子
      }
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: '帖子不存在或无权删除'
      });
    }

    await post.destroy();

    res.json({
      status: 'success',
      message: '帖子已删除'
    });
  } catch (error) {
    console.error('删除帖子失败:', error);
    res.status(500).json({
      status: 'error',
      message: '删除帖子失败'
    });
  }
});

module.exports = router; 