import React,
 { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const { connect } = useSocketContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username, room);
      onLogin(username);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
};

export default LoginPage;