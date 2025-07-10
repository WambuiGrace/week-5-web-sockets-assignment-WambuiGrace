import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <div>
      {!user ? <LoginPage onLogin={handleLogin} /> : <ChatPage />}
    </div>
  );
}

export default App;