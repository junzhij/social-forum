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

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { phone, password });
      
      // 调试日志
      console.log('登录响应:', response.data);
      
      // 检查响应数据
      if (!response.data.token || !response.data.user) {
        throw new Error('登录响应数据格式错误');
      }
      
      const userData = response.data.user;
      const token = response.data.token;
      
      // 确保用户数据完整
      if (!userData || !userData.id || !userData.username) {
        throw new Error('用户数据不完整');
      }
      
      // 单独处理并存储超级管理员状态
      const isUserSuperAdmin = Boolean(userData.isSuperAdmin);
      console.log('当前用户是否是超级管理员:', isUserSuperAdmin);
      
      // 保存认证信息
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isUserSuperAdmin', isUserSuperAdmin);
      
      // 调试日志：确认保存的数据
      console.log('保存到 localStorage 的用户数据:', {
        token: token,
        user: userData,
        isUserSuperAdmin
      });
      
      navigate('/', { replace: true });
    } catch (err) {
      // 更详细的错误处理
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("登录失败，请稍后重试");
      }
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
            borderRadius: 1,  // 圆角与其他组件保持一致
            '& .MuiAlert-icon': { color: 'error.main' }  // 图标颜色
          }}
          onClose={() => setError('')}  // 添加关闭功能
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
            登录
          </Typography>
          
          <form onSubmit={handleLogin}>
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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
            >
              还没有账号？立即注册
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 