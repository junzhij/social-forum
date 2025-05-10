const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User, Post } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { keyword, type } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: '关键词不能为空' });
    }

    if (type === 'users') {
      const users = await User.findAll({
        where: { username: { [Op.like]: `%${keyword}%` } },
      });
      return res.json({ data: users });
    } else if (type === 'posts') {
      const posts = await Post.findAll({
        where: { content: { [Op.like]: `%${keyword}%` } },
      });
      return res.json({ data: posts });
    } else {
      return res.status(400).json({ message: '无效的搜索类型' });
    }
  } catch (error) {
    console.error('搜索失败:', error);
    return res.status(500).json({ message: '搜索失败', error: error.message });
  }
});

module.exports = router;