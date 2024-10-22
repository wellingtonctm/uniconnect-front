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

export default function Messages() {
    const [colsNumber, setColsNumber] = useState<number>(5);
    const [layout, setLayout] = useState<Column[]>(Array.from({ length: colsNumber }, () => ({ messages: [], visualHeight: 0, height: 0 })));
    const [tempMessage, setTempMessage] = useState<Message | null>(null);
    const [tempHeight, setTempHeight] = useState<number | null>(null);
    const [hiddenMessages, setHiddenMessages] = useState<Message[]>([]);
    const [lastColumn, setLastColumn] = useState<number>(0);

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
                newLayout[idx].messages.unshift(tempMessage);
                newLayout[idx].height += tempHeight;
                newLayout[idx].visualHeight += tempHeight;

                setLastColumn(idx);

                while (newLayout[idx].visualHeight - (newLayout[idx].messages[newLayout[idx].messages.length - 1].height ?? 0) > window.innerHeight && newLayout[idx].messages.length > 1) {
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

                return newLayout;
            });
            setTempMessage(null);
            setTempHeight(null);
        }
    }, [tempHeight, tempMessage]);

    useEffect(() => {
        // const webSocketService = new WebSocketService('');

        // const handleMessage = (message: Message) => {
        //     setTempMessage({ ...message, sentDate: new Date(message.sentDate) });
        // };

        // webSocketService.connect(handleMessage, console.error, console.log);

        axios.get("/Event/Messages").then((data) => {
            const messages: Message[] = [...data.data];

            let i = 0;
            const processMessage = () => {
                if (i < messages.length) {
                    setTempMessage({ ...messages[i], sentDate: new Date(messages[i].sentDate) });
                    i++;
                    setTimeout(processMessage, 1500);
                }
            };

            processMessage();
        });

        const interval = setInterval(() => {
            setHiddenMessages((prevHiddenMessages) => {
                const newHiddenMessages = [...prevHiddenMessages];

                if (newHiddenMessages.length) {
                    const removedMessage = newHiddenMessages.pop();
                    removedMessage && setTempMessage(removedMessage);
                }

                return newHiddenMessages;
            });
        }, 3000);

        return () => {
            // webSocketService.disconnect();
            clearInterval(interval);
        }
    }, []);

    const handleHeightCalculation = (element: HTMLDivElement | null) => {
        if (element) {
            setTempHeight(element.offsetHeight);
        }
    };

    return (
        <>
            <div
                style={{ gridTemplateColumns: `repeat(${colsNumber}, 1fr)` }}
                className={cn('grid bg-zinc-950 w-full h-screen overflow-hidden absolute')}
            >
                {layout.map((linhas, colIndex) => (
                    <Fragment key={colIndex}>
                        <div className={cn('flex flex-col')}>
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
        </>
    );
}
