import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface Message {
    message: string;
    user: string;
    sentDate: Date;
    height?: number;
    isNew?: boolean;
    isChosenColumn?: boolean;
};

interface MessageCardProps {
    message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    return (
        <div className={cn('p-4', message.isNew ? 'animate-slide-new' : '', !message.isNew && message.isChosenColumn ? 'animate-slide' : '')}>
            <div className='bg-zinc-800 text-white font-mono p-4 rounded-lg shadow-md'>
                <p>{message.message}</p>
                <div className="text-zinc-400 text-sm mt-2">
                    <p>Sent by: {message.user}</p>
                    <p>{message.sentDate?.toLocaleString('pt-BR')}</p>
                </div>
            </div>
        </div>
    );
};

export { MessageCard, type Message };
