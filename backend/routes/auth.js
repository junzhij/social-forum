const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';  // 使用环境变量或后备值

// 注册路由
router.post('/register', async (req, res) => {
  try {
    console.log('收到注册请求:', req.body);

    const { username, phone, password } = req.body;

    // 验证必填字段
    if (!username || !phone || !password) {
      return res.status(400).json({
        message: '用户名、手机号和密码都是必填项'
      });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: '手机号格式不正确'
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        message: '该用户名已被使用'
      });
    }

    // 检查手机号是否已存在
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({
        message: '该手机号已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      phone,
      password: hashedPassword
    });

    console.log('用户创建成功:', user.toJSON()); // 调试日志

    res.status(201).json({
      message: '注册成功',
      data: {
        id: user.id,
        username: user.username,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('注册错误:', error); // 调试日志
    res.status(500).json({
      message: '注册失败',
      error: error.message
    });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    console.log('收到登录请求:', req.body);
    const { phone, password } = req.body;

    // 验证请求体
    if (!phone || !password) {
      return res.status(400).json({
        message: '手机号和密码不能为空'
      });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: '手机号格式不正确'
      });
    }

    // 查找用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({
        message: '用户不存在'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: '密码错误'
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('登录成功:', { userId: user.id, username: user.username });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (error) {
    console.error('登录处理错误:', error);
    res.status(500).json({
      message: '服务器错误，请稍后重试'
    });
  }
});

// 验证令牌的路由
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ valid: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.json({ valid: false });
    }

    // 检查用户是否被封禁
    if (user.isBanned) {
      const now = new Date();
      if (!user.banExpireAt || user.banExpireAt > now) {
        return res.json({
          valid: false,
          banned: true,
          banReason: user.banReason,
          banExpireAt: user.banExpireAt
        });
      } else {
        // 封禁已过期，自动解封
        await user.update({
          isBanned: false,
          banReason: null,
          banExpireAt: null
        });
      }
    }

    return res.json({ 
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('验证令牌失败:', error);
    return res.json({ valid: false });
  }
});

module.exports = router; 