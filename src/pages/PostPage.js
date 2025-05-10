import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PostPage() {
  const { id } = useParams(); // 使用 useParams 获取路由参数

  const [post, setPost] = useState(null);

  useEffect(() => {
    // 假数据模拟
    const fetchedPost = { id, title: `帖子 ${id} 标题`, content: '帖子详细内容...' };
    setPost(fetchedPost);
  }, [id]);

  if (!post) return <div>加载中...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export default PostPage;
