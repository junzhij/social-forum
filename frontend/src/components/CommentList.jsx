import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Box, Typography } from '@mui/material';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('获取评论失败:', error);
        setError('获取评论失败');
      }
    };
    fetchComments();
  }, [postId]);

  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment.id}>
          <ListItemAvatar>
            <Avatar>
              {comment.author?.username?.[0] || '匿'}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  {comment.author?.username || '匿名用户'}
                </Typography>
                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Box>
            }
            secondary={comment.content}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentList; 