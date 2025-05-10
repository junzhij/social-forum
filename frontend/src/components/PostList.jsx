import React, { useState, useEffect } from 'react';
import { 
  List, ListItem, ListItemText, Paper, Typography,
  Card, CardContent, CardActionArea, Box, CardHeader, Avatar, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { Alert } from '@mui/material';
import { API_BASE_URL } from '../config';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('开始获取帖子，API地址:', API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/api/posts`, {
          timeout: 5000,  // 设置超时时间
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('获取到的帖子数据:', response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('获取帖子失败:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        setError(error.response?.data?.message || '获取帖子失败');
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleLike = (postId) => {
    // Implementation of handleLike function
  };

  const handleComment = (postId) => {
    // Implementation of handleComment function
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      mx: -3,
      px: 3,
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <List sx={{ 
        p: 0,
        width: '100%'
      }}>
        {posts.map((post, index) => (
          <ListItem 
            key={post.id} 
            sx={{ 
              p: 0,
              mb: index < posts.length - 1 ? 2 : 0,
              position: 'relative',
              '&:hover': {
                '& > .MuiBox-root': {
                  transform: 'translateY(-1px)',
                  boxShadow: '3px 6px 20px rgba(0,0,0,0.1)'
                }
              }
            }}
          >
            <Box sx={{ 
              width: '100%',
              p: 3,
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: '2px 4px 12px rgba(0,0,0,0.06)',
              position: 'relative',
              transition: 'all 0.2s ease-in-out'
            }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1, 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <Avatar sx={{ mr: 1 }}>
                  {post.author?.username?.[0] || '匿'}
                </Avatar>
                <Typography variant="subtitle1">
                  {post.author?.username || '匿名用户'}
                </Typography>
                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                onClick={() => handlePostClick(post.id)}
              >
                {post.content}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  color={post.liked ? "primary" : "default"}
                >
                  <ThumbUpIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {post.likes || 0}
                </Typography>
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  handleComment(post.id);
                }}>
                  <CommentIcon />
                </IconButton>
                <Typography variant="body2">
                  {post.commentCount || 0}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default PostList; 