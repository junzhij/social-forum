require('dotenv').config();

module.exports = {
  development: {
    username: "forum_user",
    password: process.env.DB_PASSWORD,
    database: "social_forum",
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}; 