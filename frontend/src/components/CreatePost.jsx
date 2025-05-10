import React, { useState, useEffect } from 'react';
import { 
  Paper, TextField, Button, Typography, Box, 
  Checkbox, FormControlLabel, Snackbar, Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePost() {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      setError('请先登录后再发帖');
      setOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      console.log('发送请求的 token:', token);
      
      const response = await axios.post('http://localhost:8080/api/posts', 
        {
          content,
          isAnonymous
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        navigate('/');
      }
    } catch (error) {
      console.error('发帖失败:', error.response?.data);
      if (error.response?.status === 401) {
        // 清除过期的登录状态
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      setError(error.response?.data?.message || '发帖失败，请重试');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>发布新帖子</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center', 
            gap: 2,
            mt: 2 
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            }
            label="匿名发布"
          />
          <Button type="submit" variant="contained">
            发布
          </Button>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity="error" onClose={() => setOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default CreatePost; 