import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, Typography, Avatar, Button, Box, Divider,
  List, ListItem, ListItemText, ListItemIcon,
  Card, CardContent, Grid, CardActionArea, IconButton,
  Badge, Container, Alert, Fab
} from '@mui/material';
import { 
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Article as ArticleIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  CameraAlt,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AvatarEditorDialog from './AvatarEditor';

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [posts, setPosts] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // 处理头像 URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:8080${avatarPath}`; // 使用后端服务器地址
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser || !parsedUser.username) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      
      // 获取用户的帖子数据
      const fetchUserPosts = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${parsedUser.id}/posts`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          // 直接使用返回的数据数组
          setPosts(response.data);
        } catch (error) {
          console.error('获取用户帖子失败:', error);
          setError('获取帖子失败');
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        }
      };
      
      fetchUserPosts();
    } catch (error) {
      console.error('解析用户数据失败:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    if (event.target.files?.[0]) {
      setSelectedImage(event.target.files[0]);
      setEditorOpen(true);
    }
  };

  const handleSaveAvatar = async (blob) => {
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.png');
    
    setEditorOpen(false);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/users/avatar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status === 'success') {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      alert('上传头像失败: ' + (error.response?.data?.message || '请稍后重试'));
    }
  };

  const handleNewPost = () => {
    navigate('/new-post');
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('删除帖子失败:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      mx: -2,
      px: 2,
    }}>
      {/* 头像和个人信息部分 */}
      <Paper elevation={3} sx={{ 
        p: 3,
        mb: 3,
        borderRadius: 4,
        boxShadow: '2px 4px 12px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                size="small"
                sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                onClick={handleAvatarClick}
              >
                <CameraAlt sx={{ color: 'white', fontSize: '1.2rem' }} />
              </IconButton>
            }
          >
            <Avatar
              src={getAvatarUrl(user.avatar)}
              sx={{ width: 80, height: 80, cursor: 'pointer' }}
              onClick={handleAvatarClick}
            >
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
          </Badge>
          
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          {/* 用户信息部分 */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
              <Typography variant="h6" sx={{ flexGrow: 1, m: 0, lineHeight: 1.2 }}>
                {user.username}
              </Typography>
              <IconButton onClick={() => navigate('/settings')} sx={{ p: 0 }}>
                <SettingsIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ m: 0, lineHeight: 1.2 }}>
              {user.phone}
            </Typography>
            
            {user.isAdmin && (
              <Typography variant="body2" color="primary" sx={{ m: 0, mt: 0.5, lineHeight: 1 }}>
                管理员
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* 统计数据 */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* 获赞 */}
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.likesCount || 0}</Typography>
              <Typography variant="body2" color="text.secondary">获赞</Typography>
            </Box>
          </Grid>
          {/* 粉丝 */}
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.followersCount || 0}</Typography>
              <Typography variant="body2" color="text.secondary">粉丝</Typography>
            </Box>
          </Grid>
          {/* 关注 */}
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{user.followingCount || 0}</Typography>
              <Typography variant="body2" color="text.secondary">关注</Typography>
            </Box>
          </Grid>
          {/* 等级 */}
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                mx: 'auto',
                mb: 1
              }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    lineHeight: 1
                  }}
                >
                  {user.level || 1}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">等级</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 用户帖子列表 */}
      <Box sx={{ 
        flex: 1,
        overflow: 'visible',
        position: 'relative',
      }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            mb: 3,
          }}
        >
          我的帖子
        </Typography>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}
        <List sx={{ 
          p: 0,
          width: '100%',
          position: 'relative',
          zIndex: 1
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
                transition: 'all 0.2s ease-in-out',
                zIndex: 1
              }}>
                <Box sx={{ 
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '.MuiListItem-root:hover &': {
                    opacity: 1
                  }
                }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.lighter'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h6">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.content}
                </Typography>
              </Box>
            </ListItem>
          ))}
          {posts.length === 0 && !error && (
            <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
              暂无帖子
            </Typography>
          )}
        </List>
      </Box>

      <Fab
        color="primary"
        aria-label="add post"
        onClick={handleNewPost}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          borderRadius: '50%'
        }}
      >
        <AddIcon />
      </Fab>

      {/* 头像编辑器对话框 */}
      <AvatarEditorDialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        image={selectedImage}
        onSave={handleSaveAvatar}
      />
    </Box>
  );
}

export default Profile; 