// Login.jsx
import React, { useState } from 'react';
import '../styles/Login.css'; // Import styles

const Login = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminEmail = "admin@example.com"; // Dummy email
  const adminPassword = "admin123"; // Dummy password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      onLogin(); // Trigger login success
    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <p className="close-btn" onClick={onClose}>✖</p>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
