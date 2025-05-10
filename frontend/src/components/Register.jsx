import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        phone,
        password
      });

      if (response.data.message === "用户注册成功！") {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "注册失败");
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: '0 !important'  // 移除容器的默认内边距
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            borderRadius: 1,
            '& .MuiAlert-icon': { color: 'error.main' }
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            maxWidth: '600px',  // 限制表单宽度
            mx: 'auto'  // 水平居中
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom align="center">
            注册
          </Typography>
          
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="用户名"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <TextField
              fullWidth
              label="手机号"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            
            <TextField
              fullWidth
              label="密码"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <TextField
              fullWidth
              label="确认密码"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              注册
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              已有账号？立即登录
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register; 