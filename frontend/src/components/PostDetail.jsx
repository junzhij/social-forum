import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, Typography, Box, Divider, TextField, Button, 
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  IconButton, Snackbar, Alert, Card, CardContent
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        console.log("帖子详情返回数据:", response.data); // 调试日志
        setPost(response.data);
        setLikeCount(response.data.likes || 0);
      } catch (error) {
        console.error('获取帖子详情失败:', error);
        setError('获取帖子详情失败');
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      setError('获取评论失败');
      setOpen(true);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) {
      setError('评论内容不能为空');
      setOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('请先登录');
        setOpen(true);
        return;
      }

      await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewComment('');
      fetchComments(); // 刷新评论列表
    } catch (error) {
      setError(error.response?.data?.message || '发表评论失败');
      setOpen(true);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('请先登录');
        setOpen(true);
        return;
      }

      await axios.post(`http://localhost:8080/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      setError(error.response?.data?.message || '操作失败');
      setOpen(true);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!post) {
    return <Typography>加载中...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {post && (
        <>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={post.author?.avatar}
                sx={{ mr: 1 }}
              >
                {post.isAnonymous ? '匿' : post.author?.username?.[0]}
              </Avatar>
              <Box sx={{ ml: 1 }}>
                <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
                  {post.isAnonymous ? '匿名' : post.author?.username}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ display: 'block' }}
                >
                  {new Date(post.createdAt).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1">
              {post.content}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            评论区 ({ comments.length }):
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <TextField
              id="comment-input"
              name="comment"
              fullWidth
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              sx={{ 
                mb: 1,
                '& .MuiInputBase-input': {  // 针对输入框内部的文本
                  WebkitUserSelect: 'text !important',
                  MozUserSelect: 'text !important',
                  msUserSelect: 'text !important',
                  userSelect: 'text !important',
                },
                '& textarea': {  // 针对多行文本框
                  WebkitUserSelect: 'text !important',
                  MozUserSelect: 'text !important',
                  msUserSelect: 'text !important',
                  userSelect: 'text !important',
                }
              }}
            />
            <Button variant="contained" onClick={handleComment}>
              发表评论
            </Button>
          </Box>

          <List>
            {comments.map(comment => (
              <ListItem key={comment.id} alignItems="flex-start" divider>
                <ListItemAvatar>
                  <Avatar>{comment.author?.username?.[0] || '匿'}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" variant="subtitle2">
                        {comment.author?.username || '匿名'}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.content}
                />
              </ListItem>
            ))}
            {comments.length === 0 && (
              <ListItem>
                <ListItemText primary="暂无评论" />
              </ListItem>
            )}
          </List>
        </>
      )}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={error}
      />
    </Paper>
  );
}

export default PostDetail; 