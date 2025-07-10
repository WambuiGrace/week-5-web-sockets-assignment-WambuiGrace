import React from 'react';
import { useSocketContext } from '../context/SocketContext';

const UserList = () => {
  const { users } = useSocketContext();

  return (
    <div>
      <h3>Online Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;