import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/new-post">发布帖子</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
