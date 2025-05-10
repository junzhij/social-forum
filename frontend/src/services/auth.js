import axios from 'axios';
import { API_BASE_URL } from '../config';

const login = async (credentials) => {
  try {
    console.log('开始登录请求，API地址:', `${API_BASE_URL}/api/auth/login`);

    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500; // 只有状态码大于等于500时才抛出错误
      }
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || '登录失败');
    }

    console.log('登录响应:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      throw new Error(error.response.data.message || '登录失败');
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      // 发生了一些错误，阻止了请求的发出
      throw new Error('请求失败，请稍后重试');
    }
  }
};

const register = async (userData) => {
  try {
    console.log('开始注册请求:', userData);
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('注册响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('注册失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || '注册失败，请稍后重试');
  }
};

export { login, register }; 