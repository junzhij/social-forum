const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    // 评论ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 评论内容
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 所属帖子ID（关联 posts 表）
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // 评论作者ID（关联 users 表）
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'comments',
    timestamps: true,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author',
      targetKey: 'id',
      onDelete: 'SET NULL'
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'contentId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };

  return Comment;
}; 