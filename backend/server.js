// 导入必要的依赖包
require('dotenv').config();
const express = require('express');  // Express 框架用于创建 Web 服务器
const cors = require('cors');        // CORS 中间件用于处理跨域请求
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/user');
const bcrypt = require('bcryptjs');
const path = require('path');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/db.config.js').development;
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const db = require('./models');

// 创建 Express 应用实例
const app = express();
const PORT = process.env.PORT || 8080;             // 设置服务器端口

// 最早添加请求日志中间件
app.use((req, res, next) => {
  console.log('收到请求:', {
    method: req.method,
    path: req.path,
    url: req.originalUrl,
    ip: req.ip,
    realIP: req.headers['x-real-ip'] || req.headers['x-forwarded-for'],
    origin: req.headers.origin,
    host: req.headers.host,
    userAgent: req.headers['user-agent']
  });
  next();
});

// 配置中间件
app.use(cors({
  origin: ['http://cb.beierwai.cn', 'http://www.cb.beierwai.cn', 'https://cb.beierwai.cn', 'https://www.cb.beierwai.cn'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 启用 gzip 压缩
app.use(compression());

// 添加安全头
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// 优化 body-parser 限制
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 添加请求超时中间件
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});

// 全局 Sequelize 实例变量，用于路由中访问数据库连接
let sequelizeInstance;

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

// 创建必要的目录
[uploadsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// 配置静态文件服务
app.use('/uploads', express.static(uploadsDir, {
  fallthrough: true,  // 如果文件不存在，继续到下一个中间件
  index: false,       // 禁用目录列表
  maxAge: '1d'        // 缓存控制
}));

// 处理 404 的中间件
app.use('/uploads/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: '文件不存在'
  });
});

// 数据库状态检查中间件
app.get('/api/health', async (req, res) => {
  try {
    if (!sequelizeInstance) throw new Error("数据库实例未初始化");
    await sequelizeInstance.authenticate();
    res.json({ 
      status: 'ok',
      message: '数据库连接正常'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: '数据库连接失败'
    });
  }
});

// 数据库表结构检查
app.get('/api/debug/tables', async (req, res) => {
  try {
    if (!sequelizeInstance) throw new Error("数据库实例未初始化");
    const [results] = await sequelizeInstance.query('SHOW TABLES');
    const tables = await Promise.all(
      results.map(async (table) => {
        const tableName = table[`Tables_in_social_forum`];
        const [columns] = await sequelizeInstance.query(`DESCRIBE ${tableName}`);
        return {
          tableName,
          columns
        };
      })
    );
    res.json({
      status: 'success',
      tables
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '获取表结构失败',
      error: error.message
    });
  }
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器正常运行' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误详情:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  res.status(500).json({
    status: 'error',
    message: err.message || '服务器内部错误'
  });
});

// 验证环境变量是否加载
console.log('环境变量检查:', {
  hasJwtSecret: !!process.env.JWT_SECRET,
  jwtSecretLength: process.env.JWT_SECRET?.length,
  jwtSecret: process.env.JWT_SECRET  // 临时添加用于调试
});

// 添加错误处理
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    fs.appendFileSync('/www/wwwroot/forum/backend/error.log', `未捕获的异常: ${err}\n`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
    fs.appendFileSync('/www/wwwroot/forum/backend/error.log', `未处理的 Promise 拒绝: ${reason}\n`);
});

// 同步数据库并启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await db.sequelize.authenticate();
    console.log('数据库连接成功。');

    // 同步数据库模型（不强制）
    await db.sequelize.sync({ force: false });
    console.log('数据库同步完成。');

    // 启动服务器
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
    });

    // 错误处理
    server.on('error', (error) => {
      console.error('服务器错误:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();

app.use('/api/posts', async (req, res, next) => {
  console.log('收到请求:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers
  });
  try {
    await sequelizeInstance.authenticate();
    console.log('数据库连接成功');
    fs.appendFileSync('/www/wwwroot/forum/backend/error.log', '数据库连接成功\n');
    next();
  } catch (error) {
    console.error('数据库连接失败:', error);
    fs.appendFileSync('/www/wwwroot/forum/backend/error.log', `数据库连接失败: ${error}\n`);
    res.status(500).json({ message: '数据库连接失败' });
  }
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  fs.appendFileSync('/www/wwwroot/forum/backend/error.log', `服务器错误: ${err}\n`);
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 处理未找到的路由
app.use((req, res) => {
  res.status(404).json({ message: '未找到请求的资源' });
});
