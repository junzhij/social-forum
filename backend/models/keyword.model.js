const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Keyword = sequelize.define('Keyword', {
    // 关键词ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 脏话关键词
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'Keywords',
    timestamps: false,
  });

  return Keyword;
}; 