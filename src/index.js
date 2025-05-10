import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 使用 createRoot 创建根实例
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
