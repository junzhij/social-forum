const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const dbConfig = require('../config/db.config.js').development;
const db = {};

console.log('数据库配置:', {
  database: dbConfig.database,
  username: dbConfig.username,
  host: dbConfig.host,
  port: dbConfig.port
});

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  logging: msg => fs.appendFileSync('error.log', msg + '\n'),
  pool: dbConfig.pool
});

// 添加连接测试
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功。');
  })
  .catch(err => {
    console.error('无法连接到数据库:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 