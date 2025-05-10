const posts = require('../controllers/post.controller');

module.exports = (app) => {
  app.get('/api/posts', posts.getAllPosts);
  app.post('/api/posts', posts.createPost);
  app.get('/api/posts/:id', posts.getPostById);
}; 