const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PostLike = sequelize.define('PostLike', {
    // 点赞记录ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 被点赞的帖子ID
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 点赞的用户ID
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'postlikes',
    timestamps: true,
  });

  PostLike.associate = (models) => {
    PostLike.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id' });
    PostLike.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
  };

  return PostLike;
}; 