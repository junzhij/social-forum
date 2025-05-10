import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        页面未找到
      </Typography>
      <Typography variant="body1" paragraph>
        抱歉，您访问的页面不存在。
      </Typography>
      <Box mt={2}>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary"
        >
          返回首页
        </Button>
      </Box>
    </Paper>
  );
}

export default NotFound; 