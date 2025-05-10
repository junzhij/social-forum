require('dotenv').config();
const { Sequelize } = require('sequelize');

// 打印环境变量
console.log('环境变量:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功！');
    } catch (error) {
        console.error('数据库连接失败:', error);
    } finally {
        process.exit();
    }
}

testConnection(); 