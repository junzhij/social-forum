import React from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <div className="post-item">
      <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
      <p>{post.content.slice(0, 100)}...</p>
    </div>
  );
}

export default PostItem;
