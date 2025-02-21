import React ,{useState} from 'react';
import'./logTest.css';
import { useNavigate } from 'react-router-dom';

function logins(){


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
export default logins;
