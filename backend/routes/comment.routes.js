const comments = require('../controllers/comment.controller');

module.exports = (app) => {
  app.get('/api/posts/:postId/comments', comments.getComments);
  app.post('/api/posts/:postId/comments', comments.createComment);
}; 