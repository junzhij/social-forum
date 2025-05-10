import React, { useState, useEffect } from 'react';
import PostList from '../components/PostList';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用 axios 替代 fetch，处理更好的错误信息
        const response = await fetch('http://localhost:5000/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.data || []); // 使用 data.data 因为我们的后端返回格式是 { status, data }
        
      } catch (error) {
        console.error('获取帖子失败:', error);
        if (!window.navigator.onLine) {
          setError('网络连接已断开，请检查网络连接');
        } else if (error.message.includes('Failed to fetch')) {
          setError('无法连接到服务器，请确保后端服务器正在运行');
        } else {
          setError('获取帖子失败: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">社交论坛</h1>
      
      {loading && (
        <div className="text-center py-4">
          <p>加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline"
          >
            重试
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-4">
          <p>暂无帖子</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <PostList posts={posts} />
      )}
    </div>
  );
}

export default HomePage;
