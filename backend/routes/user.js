const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const { authJwt } = require('../middleware');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('令牌验证失败:', error);
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

// 获取用户的帖子
router.get('/:userId/posts', authJwt.verifyToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { authorId: req.params.userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'username'],
        as: 'author',
        required: false
      }],
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
      ]
    });
    res.json(posts);
  } catch (error) {
    console.error('获取用户帖子失败:', error);
    res.status(500).json({ message: '获取用户帖子失败' });
  }
});

// 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }

    const avatarUrl = `/uploads/avatars/${path.basename(req.file.path)}`;

    // 删除用户之前的头像
    const user = await User.findByPk(req.user.id);
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    await User.update(
      { avatar: avatarUrl },
      { where: { id: req.user.id } }
    );

    // 获取更新后的用户信息
    const updatedUser = await User.findByPk(req.user.id);

    res.json({
      status: 'success',
      message: '头像上传成功',
      avatar: avatarUrl,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    // 如果上传失败，删除已上传的文件
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: '上传头像失败' });
  }
});

module.exports = router; 