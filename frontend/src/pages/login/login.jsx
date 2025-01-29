import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import api from "../auth/auth";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await  api.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      localStorage.setItem('access_token',response.data.access)
      localStorage.setItem('refresh_token',response.data.refresh)

      setMessage(response.data.message || 'Login successful!');
      if (response.status === 200){
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      setMessage(error.response?.data?.message || 'There was an error submitting the data.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
