import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        数据库管理页面
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        此页面用于管理数据库，展示类似于数据库管理软件的视图。你可以在此基础上扩展查询、编辑、导出等功能。
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        返回
      </Button>
    </Box>
  );
}

export default AdminDashboard; 