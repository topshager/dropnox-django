import React ,{useState} from 'react';
import './login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password,setPassword] = useState('');

  const handelSubmit = (e) => {
    e.preventDefault();


};

return (
  <div className="login-container">
    <h1>Login Page</h1>
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
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
        />
      </div>
      <button type="submit" className="login-btn">Login</button>
    </form>
  </div>
);
};


export default Login
