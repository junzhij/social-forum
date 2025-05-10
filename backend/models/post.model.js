const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasImage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: '_create'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: '_update'
    }
  }, {
    tableName: 'posts',
    timestamps: true,
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author',
      targetKey: 'id'
    });
    Post.hasMany(models.Comment, { 
      foreignKey: 'contentId', 
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
    Post.hasMany(models.PostLike, { 
      foreignKey: 'postId', 
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
  };

  return Post;
}; 