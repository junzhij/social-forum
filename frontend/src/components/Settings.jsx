import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Settings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState(user.username || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8080/api/users/password',
        { newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setSuccess('密码修改成功');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setError(error.response?.data?.message || '修改密码失败');
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername.trim()) {
      setError('昵称不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8080/api/users/username',
        { newUsername },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        const updatedUser = { ...user, username: newUsername };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('昵称修改成功');
      }
    } catch (error) {
      setError(error.response?.data?.message || '修改昵称失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isUserSuperAdmin');
    navigate('/login');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        账号设置
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          修改昵称
        </Typography>
        <TextField
          fullWidth
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          margin="normal"
          label="新昵称"
        />
        <Button
          variant="contained"
          onClick={handleChangeUsername}
          sx={{ mt: 1 }}
        >
          保存昵称
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          修改密码
        </Typography>
        <TextField
          fullWidth
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          label="新密码"
        />
        <TextField
          fullWidth
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          label="确认新密码"
        />
        <Button
          variant="contained"
          onClick={handleChangePassword}
          sx={{ mt: 1 }}
        >
          修改密码
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {localStorage.getItem('isUserSuperAdmin') === 'true' && (
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ mb: 2 }}
          onClick={() => navigate('/admin')}
        >
          高级管理
        </Button>
      )}

      <Button
        variant="outlined"
        color="error"
        onClick={handleLogout}
        fullWidth
      >
        退出登录
      </Button>
    </Paper>
  );
}

export default Settings; 