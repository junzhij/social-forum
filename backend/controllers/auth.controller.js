const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = await db.User.create({
      username: req.body.username,
      phone: req.body.phone,
      password: hashedPassword
    });
    res.send({ message: "用户注册成功！" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { phone: req.body.phone },
      attributes: ['id', 'username', 'password', 'phone', 'isSuperAdmin']
    });

    if (!user) {
      return res.status(404).send({ message: "用户不存在！" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "密码错误！" });
    }

    const token = jwt.sign({ id: user.id }, "your-jwt-secret", {
      expiresIn: 86400 // 24小时
    });

    // 构造返回的用户数据，确保包含 isSuperAdmin 字段
    const responseUser = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      isSuperAdmin: Boolean(user.isSuperAdmin)  // 确保转换为布尔值
    };

    // 修改为与当前返回格式一致
    res.send({
      token: token,
      user: responseUser
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}; 