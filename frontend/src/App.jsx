import React, { useState, useEffect, useRef } from 'react';
import { 
  Link, 
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
  Routes,
  Navigate,
  useLocation
} from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import PostList from './components/PostList.jsx';
import PostDetail from './components/PostDetail.jsx';
import CreatePost from './components/CreatePost.jsx';
import Login from './pages/Login';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';
import Search from './components/Search.jsx';
import Settings from './components/Settings.jsx';
import NotFound from './components/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import axios from 'axios';
import './styles/global.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

// 重写 console.warn 过滤 React Router Future Flag 警告信息
const originalWarn = console.warn;
console.warn = function(msg, ...args) {
  if (typeof msg === 'string' && msg.includes("React Router Future Flag Warning")) {
    return;
  }
  originalWarn.call(console, msg, ...args);
};

// 创建根布局组件
function Root({ username, isLoggedIn, handleLogout }) {
  const location = useLocation();
  const scrollPositions = useRef({});
  const mainContentRef = useRef(null);

  useEffect(() => {
    // 保存当前页面的滚动位置
    if (mainContentRef.current) {
      const currentPath = location.pathname;
      scrollPositions.current[currentPath] = mainContentRef.current.scrollTop;
    }
    
    // 恢复新页面的滚动位置
    if (mainContentRef.current) {
      const savedPosition = scrollPositions.current[location.pathname] || 0;
      mainContentRef.current.scrollTop = savedPosition;
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        overflowY: 'auto',
        margin: 0,
        padding: 0,
      }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: 'primary.main',
            borderRadius: '8px',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
            mx: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            width: 'auto',
            '& .MuiToolbar-root': {
              minHeight: { xs: '48px', sm: '56px' }
            }
          }}
        >
          <Toolbar 
            sx={{ 
              p: 0
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'space-evenly',
              px: { xs: 2, sm: 3 },
              '& .MuiButton-root': {
                minWidth: { xs: '60px', sm: '80px', md: '120px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textTransform: 'none',
                mx: 0
              }
            }}>
              <Button color="inherit" component={Link} to="/">首页</Button>
              <Button color="inherit" component={Link} to="/create">发帖</Button>
              <Button color="inherit" component={Link} to="/search">搜索</Button>
              <Button 
                color="inherit" 
                component={Link} 
                to={isLoggedIn ? "/profile" : "/login"}
              >
                我的
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container 
          maxWidth="md" 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 2, sm: 2.5, md: 3 },
            pb: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // 更严格的登录状态检查
  const isAuthenticated = token && user && user.id;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [banInfo, setBanInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollPositions = useRef({});
  const mainContentRef = useRef(null);

  useEffect(() => {
    // 保存当前页面的滚动位置
    if (mainContentRef.current) {
      const currentPath = location.pathname;
      scrollPositions.current[currentPath] = mainContentRef.current.scrollTop;
    }
    
    // 恢复新页面的滚动位置
    if (mainContentRef.current) {
      const savedPosition = scrollPositions.current[location.pathname] || 0;
      mainContentRef.current.scrollTop = savedPosition;
    }
  }, [location.pathname]);

  useEffect(() => {
    // 立即检查本地存储中的登录状态
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('初始检查登录状态:', { 
      hasToken: !!token, 
      hasUserData: !!userData,
      userData: userData ? JSON.parse(userData) : null
    });

    const setLoginState = (user) => {
      setUsername(user.username);
      setIsLoggedIn(true);
      console.log('设置登录状态:', {
        username: user.username,
        isLoggedIn: true
      });
    };

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.username) {
          setLoginState(user);
          console.log('从本地存储恢复登录状态成功');
        }
      } catch (error) {
        console.error('解析用户数据失败:', error);
      }
    }

    // 检查登录状态
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('定期检查登录状态:', { 
        hasToken: !!token, 
        hasUserData: !!userData,
        currentIsLoggedIn: isLoggedIn,
        token: token
      });
      
      if (token && userData) {
        try {
          const response = await axios.get('http://localhost:8080/api/auth/verify', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('验证请求详情:', {
            token: token,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('验证接口响应:', response.data);
          
          if (response.data.valid) {
            const user = JSON.parse(userData);
            setLoginState(user);
            setBanInfo(null);
          } else if (response.data.banned) {
            setIsLoggedIn(false);
            setBanInfo({
              reason: response.data.banReason,
              expireAt: new Date(response.data.banExpireAt)
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setUsername('');
          }
        } catch (error) {
          console.error('验证登录状态失败:', error);
        }
      }
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 3600000); // 每小时检查一次
    return () => clearInterval(intervalId);
  }, []);

  // 使用另一个 useEffect 来处理路由重定向
  useEffect(() => {
    console.log('路由重定向检查:', { 
      isLoggedIn, 
      currentPath: window.location.pathname 
    });
    
    if (isLoggedIn) {
      if (window.location.pathname === '/login') {
        console.log('已登录，从登录页重定向到首页');
        navigate('/');
      }
    } else {
      if (window.location.pathname === '/profile') {
        console.log('未登录，从个人页重定向到登录页');
        navigate('/login');
      }
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    console.log('执行登出操作');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername('');
    setIsLoggedIn(false);
    navigate('/');
  };

  // 每次渲染时打印当前状态
  console.log('当前组件状态:', { 
    username, 
    isLoggedIn, 
    hasToken: !!localStorage.getItem('token'),
    hasUserData: !!localStorage.getItem('user')
  });

  // 显示封禁提示
  if (banInfo) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          zIndex: 9999
        }}
      >
        <Typography variant="h4" gutterBottom>
          账号已被封禁
        </Typography>
        <Typography variant="body1" gutterBottom>
          封禁原因: {banInfo.reason}
        </Typography>
        <Typography variant="body1">
          解封时间: {banInfo.expireAt.toLocaleString()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="lg" sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo/首页链接 */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0
              }}
            >
              {isLoggedIn ? `欢迎${username}` : '欢迎访问'}
            </Typography>

            {/* 导航链接 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
                sx={{ 
                  minWidth: 40,
                  height: 40,
                  p: 0,
                  borderRadius: 2
                }}
              >
                <HomeIcon />
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/search"
                sx={{ 
                  minWidth: 40,
                  height: 40,
                  p: 0,
                  borderRadius: 2
                }}
              >
                <SearchIcon />
              </Button>
              {isLoggedIn ? (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  sx={{ 
                    minWidth: 40,
                    height: 40,
                    p: 0,
                    borderRadius: 2
                  }}
                >
                  <PersonIcon />
                </Button>
              ) : (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    minWidth: 40,
                    height: 40,
                    p: 0,
                    borderRadius: 2
                  }}
                >
                  <PersonIcon />
                </Button>
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* 占位符 */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          px: 0,
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <Box 
          ref={mainContentRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'visible',
            py: 3,
            px: { xs: 2, sm: 4 },
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={
        <AppContent />
      }>
        <Route index element={<PostList />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="create" element={<CreatePost />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    ),
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_normalizeFormMethod: true
      }
    }
  );

  return <RouterProvider router={router} />;
}

export default App; 