import React, { useEffect, useRef, useState } from 'react';

type MessageType = { message: string; user: string; sentDate: string; height: number; new: boolean; };

const MessageBoard: React.FC = () => {
    const [numColumns, setNumColumns] = useState(5);

    const [columns, setColumns] = useState<MessageType[][]>(
        Array.from({ length: numColumns }, () => [])
    );

    const [heights, setHeights] = useState<number[]>(
        Array.from({ length: numColumns }, () => 0)
    );

    const [visualHeights, setVisualHeights] = useState<number[]>(
        Array.from({ length: numColumns }, () => 0)
    );

    const [stack, setStack] = useState<MessageType[]>([]);

    const [messageIndex, setMessageIndex] = useState(0);

    const messageList = [
        { message: 'Hello!', user: 'Alice' },
        { message: 'This is a longer message that might take up more space.', user: 'Bob' },
        { message: 'Short one.', user: 'Charlie' },
        { message: 'Another long message that will occupy a bit more room than others.', user: 'Alice' },
        { message: 'How about this one? It\'s just a normal message.', user: 'David' },
        { message: 'A short message.', user: 'Eve' },
        { message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', user: 'Frank' },
        { message: 'Short again.', user: 'Alice' },
        { message: 'Just a quick note.', user: 'Bob' },
        { message: 'And here\'s another message to fill the column!', user: 'Charlie' },
        { message: 'Hello!', user: 'Alice' },
        { message: 'This is a longer message that might take up more space.', user: 'Bob' },
        { message: 'Short one.', user: 'Charlie' },
        { message: 'Another long message that will occupy a bit more room than others.', user: 'Alice' },
        { message: 'How about this one? It\'s just a normal message.', user: 'David' },
        { message: 'A short message.', user: 'Eve' },
        { message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', user: 'Frank' },
        { message: 'Short again.', user: 'Alice' },
        { message: 'Just a quick note.', user: 'Bob' },
        { message: 'And here\'s another message to fill the column!', user: 'Charlie' },
        { message: 'Hello!', user: 'Alice' },
        { message: 'This is a longer message that might take up more space.', user: 'Bob' },
        { message: 'Short one.', user: 'Charlie' },
        { message: 'Another long message that will occupy a bit more room than others.', user: 'Alice' },
        { message: 'How about this one? It\'s just a normal message.', user: 'David' },
        { message: 'A short message.', user: 'Eve' },
        { message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', user: 'Frank' },
        { message: 'Short again.', user: 'Alice' },
        { message: 'Just a quick note.', user: 'Bob' },
        { message: 'And here\'s another message to fill the column!', user: 'Charlie' },
        { message: 'This is a longer message that might take up more space.', user: 'Bob' },
        { message: 'Short one.', user: 'Charlie' },
        { message: 'Another long message that will occupy a bit more room than others.', user: 'Alice' },
        { message: 'How about this one? It\'s just a normal message.', user: 'David' },
        { message: 'A short message.', user: 'Eve' },
        { message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', user: 'Frank' },
        { message: 'Short again.', user: 'Alice' },
        { message: 'Just a quick note.', user: 'Bob' },
        { message: 'And here\'s another message to fill the column!', user: 'Charlie' },
    ];

    const lastCardRef = useRef<HTMLDivElement | null>(null);
    const lastColumnIndex = useRef<number | null>(null);

    const getShortestColumn = () => {
        return heights.indexOf(Math.min(...heights));
    };

    const sendMessage = (message: string, user: string) => {
        addMessageToScreen({ message, user, height: 0, sentDate: new Date().toLocaleString('pt-BR'), new: true })
    }

    const addMessageToScreen = (message: MessageType) => {
        const columnIndex = getShortestColumn();

        setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            newColumns[columnIndex] = [
                message,
                ...newColumns[columnIndex],
            ];
            return newColumns;
        });

        lastColumnIndex.current = columnIndex;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (stack.length) {
                const msg = stack.pop();
                msg && addMessageToScreen({ ...msg })
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [stack, numColumns]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (messageIndex < messageList.length) {
                const msg = messageList[messageIndex];
                sendMessage(msg.message, msg.user);
                setMessageIndex(prevIndex => prevIndex + 1);
            } else {
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [messageIndex, messageList, numColumns]);

    useEffect(() => {
        if (lastColumnIndex.current !== null) {
            const newVisualHeights = [...visualHeights];
            const newStack = [...stack];
            const currentColumnIndex = lastColumnIndex.current;

            if (lastCardRef.current) {
                const cardHeight = lastCardRef.current.offsetHeight;
                columns[currentColumnIndex][0].height = cardHeight;
                newVisualHeights[currentColumnIndex] += cardHeight;
                setVisualHeights(newVisualHeights);

                setHeights(prevHeights => {
                    const newHeights = [...prevHeights];
                    newHeights[currentColumnIndex] += cardHeight;
                    return newHeights;
                });
            }

            let lastCardHeight = columns[currentColumnIndex][columns[currentColumnIndex].length - 1].height;

            while (newVisualHeights[currentColumnIndex] - lastCardHeight > window.innerHeight && columns[currentColumnIndex].length > 1) {
                const removedCard = columns[currentColumnIndex].pop();

                if (removedCard) {
                    newVisualHeights[currentColumnIndex] -= removedCard.height;
                    setVisualHeights(newVisualHeights);
                    newStack.unshift({ ...removedCard, new: false });
                }

                lastCardHeight = columns[currentColumnIndex][columns[currentColumnIndex].length - 1].height;
            }

            lastCardRef.current = null;
            setStack(newStack);
        }
    }, [columns, lastCardRef.current, lastColumnIndex.current, numColumns]);

    (window as any).sendMessage = sendMessage;

    (window as any).stack = () => { console.log(stack) };

    return (
        <>
            <input type="number" value={numColumns} onChange={(e) => { setNumColumns(Number(e.target.value)) }} />
            <div
                // className="w-full h-full flex justify-center overflow-hidden items-start"
                style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
                className={`grid`}
            >
                {columns.map((column, colIndex) => (
                    <div
                        key={colIndex}
                        className={`flex flex-col`}
                    >
                        {column.map((msg, msgIndex) => (
                            <div
                                key={msgIndex}
                                ref={msgIndex === 0 && colIndex === lastColumnIndex.current ? lastCardRef : null}
                                className={`p-4 transition-all duration-300 ease-in-out transform ${msgIndex === 0 && colIndex === lastColumnIndex.current ? msg.new ? 'animate-fade' : 'animate-slide-new' : ''
                                    } ${msgIndex !== 0 && colIndex === lastColumnIndex.current ? 'animate-slide' : ''
                                    }`}
                            >
                                <div className='bg-gray-800 text-white font-mono p-4 rounded-lg shadow-md'>
                                    <p>{msg.message}</p>
                                    <div className="text-gray-400 text-sm mt-2">
                                        <p>Sent by: {msg.user}</p>
                                        <p>{msg.sentDate}</p>
                                        <p>{msg.height}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MessageBoard;
