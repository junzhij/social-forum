import React, { useState, useEffect } from 'react';
import { 
  Paper, TextField, Button, Typography, Box, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../services/auth';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 如果已经登录，则直接跳转到首页（或个人页面），不显示"重新登录"提示
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('提交登录表单:', { phone, password });
      // 确保传递正确的参数格式
      const loginData = {
        phone: phone.trim(),
        password: password.trim()
      };
      const response = await login(loginData);
      console.log('登录成功:', response);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('username', response.user.username);
        navigate('/');
      } else {
        throw new Error('登录响应格式错误');
      }
    } catch (error) {
      console.error('登录组件错误:', error);
      setError(error.message || '登录失败，请稍后重试');
      setOpen(true);
    }
  };

  const handleContinueLogin = () => {
    setDialogOpen(false);
    // 清除现有登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (dialogOpen) {
    return (
      <Dialog open={dialogOpen}>
        <DialogTitle>您已登录</DialogTitle>
        <DialogContent>
          <Typography>
            您已经以 {localStorage.getItem('username')} 的身份登录。
            是否要重新登录？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnHome}>返回首页</Button>
          <Button onClick={handleContinueLogin} color="primary">
            重新登录
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      overflow: 'hidden'  // 禁止滚动
    }}>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom align="center">登录</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
            type="tel"
            autoComplete="tel"
            inputProps={{ 
              pattern: "^1[3-9]\\d{9}$",
              placeholder: "请输入手机号"
            }}
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3, mb: 2 }}
          >
            登录
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              还没有账号？
              <RouterLink 
                to="/register" 
                sx={{ ml: 1, color: 'primary.main' }}
              >
                立即注册
              </RouterLink>
            </Typography>
          </Box>
        </Box>
        <Snackbar 
          open={open} 
          autoHideDuration={6000} 
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ mt: 2, ml: 2 }}
        >
          <Alert 
            severity={severity} 
            variant="filled"
            onClose={() => setOpen(false)}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default Login; 