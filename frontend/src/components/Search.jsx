import React, { useState } from 'react';
import { 
  Box, TextField, InputAdornment, Typography, 
  Tabs, Tab, Card, CardContent, Avatar,
  List, ListItem, Paper, ListItemText,
  ListItemAvatar, IconButton, InputBase
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Search() {
  const [value, setValue] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('posts');

  // 处理搜索类型切换
  const handleSearchTypeChange = (event, newValue) => {
    setSearchType(newValue === 0 ? 'posts' : 'users');
    setResults([]); // 清除搜索结果
    setError('');   // 清除错误信息
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      setResults([]);
      
      const response = await axios.get(`http://localhost:8080/api/search`, {
        params: {
          keyword: keyword.trim(),
          type: searchType
        }
      });
      
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('搜索失败:', error);
      setLoading(false);
      setError('搜索失败，请稍后重试');
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.default',
        pb: 2
      }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '90%',  // 稍微收窄一点宽度
            mb: 3,
            borderRadius: 16,  // 减小圆角
            boxShadow: '2px 4px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '2px 4px 16px rgba(0,0,0,0.08)'
            }
          }}
        >
          <IconButton 
            sx={{ 
              p: '10px',
              mr: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
            }} 
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1,
              fontSize: '1rem',
              '& .MuiInputBase-input': {
                padding: '8px 0',
              }
            }}
            placeholder="搜索帖子..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              handleSearch();
            }}
          />
          {keyword && (
            <IconButton 
              sx={{ 
                p: '10px',
                ml: 1,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
              aria-label="clear"
              onClick={() => setKeyword('')}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Paper>

        <Tabs 
          sx={{ 
            mb: 2,
            width: '90%'  // 与搜索框保持一致
          }}
          value={searchType === 'posts' ? 0 : 1}
          onChange={handleSearchTypeChange}
        >
          <Tab label="帖子" />
          <Tab label="用户" />
        </Tabs>
      </Box>

      {/* 显示搜索结果 */}
      {!loading && results.length > 0 && (
        <List sx={{ p: 0 }}>
          {results.map((result) => (
            <Paper 
              key={result.id} 
              elevation={0} 
              sx={{ 
                mb: 2, 
                borderRadius: 8,
                overflow: 'hidden',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItem 
                component={Link}
                to={searchType === 'users' ? `/users/${result.id}` : `/posts/${result.id}`}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  p: 2
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={searchType === 'users' ? result.avatar : result.User?.avatar}
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {searchType === 'users' 
                      ? (result.avatar ? null : <PersonIcon />)
                      : (result.isAnonymous ? '匿' : result.User?.username?.[0])}
                  </Avatar>
                </ListItemAvatar>
                {searchType === 'users' ? (
                  <ListItemText
                    primary={result.username}
                    primaryTypographyProps={{ 
                      sx: { fontWeight: 500 }
                    }}
                  />
                ) : (
                  <Box sx={{ ml: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ mb: 0.5 }}
                    >
                      {result.isAnonymous ? '匿名' : result.User?.username}
                    </Typography>
                    <Typography variant="body2">
                      {result.content}
                    </Typography>
                  </Box>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
      
      {/* 显示无结果提示 - 只在有搜索关键词且没有结果时显示 */}
      {!loading && results.length === 0 && keyword && !error && (
        <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
          未找到相关{searchType === 'users' ? '用户' : '帖子'}
        </Typography>
      )}
      
      {/* 显示错误信息 */}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default Search; 