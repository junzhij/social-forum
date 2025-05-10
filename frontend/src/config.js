// 使用固定的服务器 IP
const SERVER_IP = '192.168.31.103';  // 你的电脑局域网 IP

// 修改为您的域名
export const API_BASE_URL = 'http://cb.beierwai.cn';

// 开发环境可以使用
// export const API_BASE_URL = process.env.NODE_ENV === 'development' 
//   ? 'http://localhost:8080'
//   : 'http://cb.beierwai.cn';

console.log('API_BASE_URL:', API_BASE_URL); 