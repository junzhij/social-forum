const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');
const PostLike = require('./postlike.model');

function initModels(sequelize) {
  const models = {
    User: User(sequelize, sequelize.Sequelize),
    Post: Post(sequelize, sequelize.Sequelize),
    Comment: Comment(sequelize, sequelize.Sequelize),
    PostLike: PostLike(sequelize, sequelize.Sequelize)
  };

  // 设置模型关联
  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
}

module.exports = initModels; 