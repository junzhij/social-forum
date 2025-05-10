const db = require('../models');

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await db.Post.findAll({
      where: { authorId: userId },
      order: [['createdAt', 'DESC']],
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
        model: db.User,
        attributes: ['id', 'username'],
        as: 'author'
      }]
    });
    
    res.json(posts);
  } catch (err) {
    console.error('获取用户帖子失败:', err);
    res.status(500).send({
      message: err.message || "获取用户帖子时发生错误。"
    });
  }
}; 