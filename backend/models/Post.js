module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'Posts',
    timestamps: true,
    modelName: 'Post',
    freezeTableName: true
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User);
    Post.hasMany(models.Comment);
    Post.hasMany(models.PostLike);
  };

  return Post;
};
