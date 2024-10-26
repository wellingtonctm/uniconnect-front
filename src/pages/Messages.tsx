import { MessageCard, Message } from "@/components/MessageCard";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import WebSocketService from "@/services/WebSocketService";
import { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface Column {
    messages: Message[];
    visualHeight: number;
    height: number;
}

interface User {
    id: number
    eventId: number
    name: string
    createdAt: string
    enabled: boolean
    messagesNumber: number
}

export default function Messages() {
    const colsNumber = 3;
    const colors = ['bg-sky-100', 'bg-rose-100', 'bg-yellow-100'];

    const [layout, setLayout] = useState<Column[]>(Array.from({ length: colsNumber }, () => ({ messages: [], visualHeight: 0, height: 0 })));
    const [tempMessage, setTempMessage] = useState<Message | null>(null);
    const [tempHeight, setTempHeight] = useState<number | null>(null);
    const [hiddenMessages, setHiddenMessages] = useState<Message[]>([]);
    const [lastColumn, setLastColumn] = useState<number>(0);

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    const getShortestColumn = () => {
        let min: number = layout[0].height;
        let index: number = 0;

        for (let i = 0; i < layout.length; i++) {
            const coluna = layout[i];

            if (coluna.height < min) {
                min = coluna.height;
                index = i;
            }
        }

        return index;
    };

    useEffect(() => {
        if (tempHeight !== null && tempMessage !== null) {
            setLayout((prevLayout) => {
                const newLayout = [...prevLayout];
                const idx = getShortestColumn();

                tempMessage.height = tempHeight;
                tempMessage.isNew = true;
                tempMessage.cor = getRandomColor();
                newLayout[idx].height += tempHeight;
                newLayout[idx].visualHeight += tempHeight;

                setLastColumn(idx);

                while (newLayout[idx].messages.length > 1 && newLayout[idx].visualHeight - (newLayout[idx].messages[newLayout[idx].messages.length - 1].height ?? 0) > 800) {
                    const removedMessage = newLayout[idx].messages.pop();

                    if (removedMessage) {
                        setHiddenMessages((prevHiddenMessages) => {
                            const newHiddenMessages = [...prevHiddenMessages];
                            newHiddenMessages.unshift(removedMessage);
                            return newHiddenMessages;
                        });

                        newLayout[idx].visualHeight -= removedMessage.height ?? 0;
                    }
                }

                newLayout[idx].messages.unshift(tempMessage);
                return newLayout;
            });
            setTempMessage(null);
            setTempHeight(null);
        }
    }, [tempHeight, tempMessage]);

    const removerMensagem = (id: number) => {
        setLayout((prevLayout) => {
            return prevLayout.map((coluna) => {
                const newMessages = coluna.messages.filter(mensagem => mensagem.id !== id);
                return {
                    ...coluna,
                    messages: newMessages,
                    visualHeight: coluna.visualHeight - (coluna.messages.find(m => m.id === id)?.height ?? 0),
                };
            });
        });

        setHiddenMessages((prevHiddenMessages) => {
            return prevHiddenMessages.filter(mensagem => mensagem.id !== id);
        });
    }

    useEffect(() => {
        const webSocketService = new WebSocketService(axios.defaults.baseURL + '/ws');

        webSocketService.connect(
            (data) => {
                if (data.type == "Message") {
                    const dados: Message = { ...data };

                    if (dados.enabled === true) {
                        setTempMessage({...dados});
                    }
                    else {
                        removerMensagem(dados.id)
                    }
                }
                else if (data.type == "User") {
                    console.log(data)
                    const dados: User = { ...data };

                    axios.get(`/User/${data.id}/Messages`).then((msgs) => {
                        const messages: Message[] = [...msgs.data];

                        if (dados.enabled) {
                            messages.forEach((message) => {
                                message.enabled && setHiddenMessages((prev) => [...prev, {...message}]);
                            })
                        }
                        else {
                            messages.forEach((message) => {
                                removerMensagem(message.id)
                            })
                        }
                    });
                }
            },
            (error) => {
                console.error('WebSocket error:', error);
            },
            (event) => {
                console.log('WebSocket closed:', event);
            }
        );

        axios.get("/Event/Messages").then((data) => {
            const messages: Message[] = [...data.data];
            setHiddenMessages(shuffleArray(messages));
        });

        return () => webSocketService.disconnect();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setHiddenMessages((prevHiddenMessages) => {
                const newHiddenMessages = [...prevHiddenMessages];

                if (newHiddenMessages.length) {
                    const removedMessage = newHiddenMessages.pop();
                    removedMessage && setTempMessage(removedMessage);
                }

                return newHiddenMessages;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [hiddenMessages]);

    const handleHeightCalculation = (element: HTMLDivElement | null) => {
        if (element) {
            setTempHeight(element.offsetHeight);
        }
    };

    return (
        <>
            <div className="w-screen h-screen bg-blue-950 teste-pattern">
                <div className="w-full h-[calc(100%-800px)] flex justify-center items-center">
                    <p className="text-white text-6xl" >JUVENTUDE | <b>IBR</b></p>
                </div>
                <div
                    style={{ gridTemplateColumns: `repeat(${colsNumber}, 1fr)` }}
                    className={cn('grid w-full h-[800px] overflow-y-hidden absolute')}
                >
                    {layout.map((linhas, colIndex) => (
                        <Fragment key={colIndex}>
                            <div style={{ width: `calc(100vw / ${colsNumber})` }} className={cn(`flex flex-col`)}>
                                {linhas && linhas.messages.map((mensagem, rowIndex) => (
                                    <MessageCard
                                        message={{ ...mensagem, isNew: rowIndex == 0 && lastColumn == colIndex, isChosenColumn: lastColumn == colIndex }}
                                        key={`${colIndex}-${rowIndex}`}
                                    />
                                ))}
                            </div>
                        </Fragment>
                    ))}
                </div>

                {tempMessage && ReactDOM.createPortal(
                    <div
                        style={{ gridTemplateColumns: `repeat(${colsNumber}, 1fr)` }}
                        className={cn('grid w-full h-screen opacity-0')}
                    >
                        <div className={cn('flex flex-col')}>
                            <div ref={handleHeightCalculation}>
                                <MessageCard message={tempMessage} />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
}
