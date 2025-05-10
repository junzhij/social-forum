const db = require("./models");

db.sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功。');
  })
  .catch(err => {
    console.error('无法连接到数据库:');
    console.error('错误代码:', err.parent.code);
    console.error('错误消息:', err.parent.sqlMessage);
    console.error('完整错误:', err);
  }); 