import { cn } from '@/lib/utils';
import React from 'react';

interface Message {
    message: string;
    user: string;
    sentDate: Date;
    height?: number;
    isNew?: boolean;
    isChosenColumn?: boolean;
    cor?: string;
};

interface MessageCardProps {
    message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    const renderMessageWithHashtags = (text: string) => {
        const hashtagPattern = /(#\w+)/g; // Match hashtags like #SomeHashTag
        const parts = text.split(hashtagPattern);
        
        return parts.map((part, index) => 
            hashtagPattern.test(part) ? (
                <span key={index} className="text-blue-500 font-bold">{part}</span> // Style for hashtags
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

    return (
        <div className={cn('p-4', message.isNew ? 'animate-slide-new' : '', !message.isNew && message.isChosenColumn ? 'animate-slide' : '')}>
            <div className={cn(message.cor ?? 'bg-indigo-800', 'text-black text-xl font-mono p-4 rounded-lg overflow-auto shadow-md')}>
                <p className='break-words overflow-wrap'>
                    {renderMessageWithHashtags(message.message)}
                </p>
                <div className="text-black text-base mt-2">
                    <p>{message.user}</p>
                    {/* <p>{message.sentDate?.toLocaleString('pt-BR')}</p> */}
                </div>
            </div>
        </div>
    );
};

export { MessageCard, type Message };
