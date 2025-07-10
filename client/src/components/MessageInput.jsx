import React, { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocketContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;