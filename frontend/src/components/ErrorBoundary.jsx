import React from 'react';
import { Typography, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h5" color="error">
            页面加载出错
          </Typography>
          <Typography variant="body1">
            请刷新页面或返回首页重试
          </Typography>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 