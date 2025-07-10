import React from 'react';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const ChatPage = () => {
  return (
    <div>
      <h2>Chat</h2>
      <UserList />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatPage;