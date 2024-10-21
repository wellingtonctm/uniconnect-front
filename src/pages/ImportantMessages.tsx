// src/pages/ImportantMessages.tsx
import React, { useEffect, useState } from 'react';
import MessageCard from '../components/MessageCard';

interface Message {
  text: string;
  date: string;
  user: string;
  importanceLevel: number; // Nível de importância
}

const ImportantMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Inicializando com algumas mensagens
  const initialMessages = [
    { text: 'Hello!', user: 'Alice', date: new Date().toISOString(), importanceLevel: 3 },
    { text: 'This is a longer message that might take up more space.', user: 'Bob', date: new Date().toISOString(), importanceLevel: 2 },
    { text: 'Short one.', user: 'Charlie', date: new Date().toISOString(), importanceLevel: 1 },
  ];

  // Função para adicionar uma nova mensagem
  const addMessage = (text: string, user: string) => {
    const newMessage = {
      text,
      user,
      date: new Date().toISOString(),
      importanceLevel: 3, // Mensagens novas têm a importância máxima
    };
    setMessages(prevMessages => [newMessage, ...prevMessages]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Se houver menos de 5 mensagens, adicione uma nova aleatória da lista
      if (messages.length < 5) {
        const randomIndex = Math.floor(Math.random() * initialMessages.length);
        const newMessage = { ...initialMessages[randomIndex], importanceLevel: 3 }; // Mensagem nova com alta importância
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      } else {
        // Se não houver novas mensagens, diminua a importância da mensagem menos importante
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          const minImportanceIndex = updatedMessages.findIndex(msg => msg.importanceLevel === 1); // Encontra a mensagem menos importante
          if (minImportanceIndex !== -1) {
            updatedMessages[minImportanceIndex].importanceLevel = 0; // Diminui a importância
          }
          return updatedMessages;
        });
      }
    }, 10000); // Verifica por novas mensagens a cada 10 segundos

    return () => clearInterval(interval); // Limpeza ao desmontar
  }, [messages]);

  // Para enviar novas mensagens pelo console
  (window as any).sendMessage = addMessage;

  return (
    <div className="flex flex-col items-center">
      {messages.map((message, index) => (
        <MessageCard
          key={index}
          message={message.text}
          user={message.user}
          date={message.date}
          style={{ height: `${(message.importanceLevel + 1) * 4}rem` }} // Altura diferente baseada na importância
        />
      ))}
    </div>
  );
};

export default ImportantMessages;
