// src/components/MessageCard.tsx
import React, { LegacyRef } from 'react';

interface MessageCardProps {
  message: string;
  ref: LegacyRef<HTMLDivElement> | undefined;
  user: string; // New prop for the user's name
  sentDate: string; // New prop for the sent date
}

const MessageCard: React.FC<MessageCardProps> = ({ message, ref, user, sentDate }) => {
  return (
    <div ref={ref} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <p>{message}</p>
      <div className="text-gray-400 text-sm mt-2">
        <p>Sent by: {user}</p>
        <p>{sentDate}</p>
      </div>
    </div>
  );
};

export default MessageCard;
