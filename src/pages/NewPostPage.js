import React, { useState } from 'react';
import axios from 'axios';  // 用于发起 HTTP 请求

function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 发送 POST 请求到后端 API
      await axios.post('http://localhost:5000/api/posts', { title, content });
      alert('帖子发布成功！');
    } catch (error) {
      console.error('发布帖子失败：', error);
      alert('发布失败，请重试！');
    }
  };

  return (
    <div>
      <h1>发布新帖子</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>标题：</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>内容：</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">发布</button>
      </form>
    </div>
  );
}

export default NewPostPage;
