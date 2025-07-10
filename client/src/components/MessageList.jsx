import React, { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useInView } from 'react-intersection-observer';

const Message = ({ msg }) => {
  const { socket } = useSocketContext();
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      socket.emit('message_read', msg.id);
    }
  }, [inView, msg.id, socket]);

  return (
    <li ref={ref}>
      <strong>{msg.sender}: </strong>
      {msg.message}
      {msg.readBy.length > 0 && (
        <small> (read by {msg.readBy.map(u => u.username).join(', ')})</small>
      )}
    </li>
  );
};

const MessageList = () => {
  const { messages } = useSocketContext();

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
      </ul>
    </div>
  );
};

export default MessageList;