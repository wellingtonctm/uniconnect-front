'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronRight } from "lucide-react"
import { useParams } from 'react-router-dom'
import axios from '@/lib/axios'
import { Switch } from '@/components/ui/switch'
import WebSocketService from '@/services/WebSocketService'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Event {
    id: number
    description: string
    layoutNumberCols: number
    createdAt: string
    enabled: boolean
    usersNumber: any
    messagesNumber: any
}

interface Message {
    id: number
    userId: number
    userName: string
    content: string
    sentAt: string
    enabled: boolean
}

interface User {
    id: number
    eventId: number
    name: string
    createdAt: string
    enabled: boolean
    messagesNumber: number
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>()

    const [event, setEvent] = useState<Event>()
    const [users, setUsers] = useState<User[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [userFilter, setUserFilter] = useState('')
    const [messageFilter, setMessageFilter] = useState('')

    const fetchEventData = () => {
        axios.get(`/Event/${id}`).then((data) => {
            const event: Event = { ...data.data };
            setEvent(event);
        });
    }

    const fetchData = () => {
        axios.get(`/Event/${id}/Users`).then((data) => {
            const users: User[] = [...data.data];
            setUsers([...users]);
        });

        axios.get(`/Message`).then((data) => {
            const messages: Message[] = [...data.data];
            setMessages([...messages]);
        });
    }

    const toggleUserBlock = (id: number, checked: boolean) => {
        axios.put(`/User/${checked ? 'Enable' : 'Disable'}/${id}`).then(() => {
            fetchData();
        });
    }

    const toggleMessageVisibility = (id: number, checked: boolean) => {
        axios.put(`/Message/${checked ? 'Enable' : 'Disable'}/${id}`).then(() => {
            fetchData();
        });
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(userFilter.toLowerCase())
    )

    const filteredMessages = messages.filter(message =>
        message.content.toLowerCase().includes(messageFilter.toLowerCase())
    )

    useEffect(() => {
        fetchEventData();
        fetchData();

        const webSocketService = new WebSocketService(axios.defaults.baseURL + '/ws');

        webSocketService.connect(
            (data) => {
                if (data.type === "Message" && data.enabled === true) {
                    const dados: Message = { ...data };
                    setMessages((prevMessages: Message[]) => {
                        const exists = prevMessages.some((message) => message.id === dados.id);
                        return exists ? prevMessages : [dados, ...prevMessages];
                    });
                }
            },            
            (error) => console.error('WebSocket error:', error),
            (event) => console.log('WebSocket closed:', event)
        );
    }, []);

    return (
        <div className='w-screen h-screen bg-[#0a0a0a]'>
            <div className="container mx-auto p-4 text-[#e4e4e7]">
                <h1 className="text-3xl text-center font-bold mb-10 text-[#e4e4e7]">{event?.description}</h1>
                <Tabs defaultValue="users" className="w-full relative">
                    <TabsList className="bg-[#18181b] border-b border-[#27272a] absolute top-0 right-0">
                        <TabsTrigger value="users" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#e4e4e7]">Usuários</TabsTrigger>
                        <TabsTrigger value="messages" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#e4e4e7]">Mensagens</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <div className="flex items-center mb-6">
                            <Input
                                type="text"
                                placeholder="Buscar usuários..."
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="max-w-sm mr-2 bg-[#18181b] text-[#e4e4e7] border-[#27272a] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            />
                            <Button variant="outline" size="icon" className="bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#e4e4e7]">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="bg-[#18181b] rounded-lg overflow-hidden border border-[#27272a]">
                            <ScrollArea className="h-[45rem]">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-[#27272a]">
                                            <TableHead className="text-[#a1a1aa]">Nome</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Status</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Mensagens</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Ativo</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map(user => (
                                            <TableRow key={user.id} className="border-b border-[#27272a]">
                                                <TableCell className="font-medium text-[#e4e4e7]">{user.name}</TableCell>
                                                <TableCell className="text-[#a1a1aa]">{user.enabled ? 'Ativo' : 'Bloqueado'}</TableCell>
                                                <TableCell className="text-[#a1a1aa]">{user.messagesNumber}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={user.enabled}
                                                        onCheckedChange={(checked: boolean) => toggleUserBlock(user.id, checked)}
                                                        className="data-[state=checked]:bg-[#3b82f6]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" className="text-[#3b82f6] hover:text-[#60a5fa] hover:bg-[#27272a]">
                                                        Detalhes <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                    <TabsContent value="messages">
                        <div className="flex items-center mb-6">
                            <Input
                                type="text"
                                placeholder="Buscar mensagens..."
                                value={messageFilter}
                                onChange={(e) => setMessageFilter(e.target.value)}
                                className="max-w-sm mr-2 bg-[#18181b] text-[#e4e4e7] border-[#27272a] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            />
                            <Button variant="outline" size="icon" className="bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#e4e4e7]">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="bg-[#18181b] rounded-lg overflow-hidden border border-[#27272a]">
                            <ScrollArea className="h-[45rem]">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-[#27272a]">
                                            <TableHead className="text-[#a1a1aa]">Usuário</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Mensagem</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Data/Hora</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Status</TableHead>
                                            <TableHead className="text-[#a1a1aa]">Visível</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMessages.map(message => (
                                            <TableRow key={message.id} className="border-b border-[#27272a]">
                                                <TableCell className="font-medium text-[#e4e4e7]">{message.userName}</TableCell>
                                                <TableCell className="text-[#a1a1aa]">{message.content}</TableCell>
                                                <TableCell className="text-[#a1a1aa]">{new Date(message.sentAt).toLocaleString('pt-BR')}</TableCell>
                                                <TableCell className="text-[#a1a1aa]">{message.enabled ? 'Visível' : 'Oculto'}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={message.enabled}
                                                        onCheckedChange={(checked: boolean) => toggleMessageVisibility(message.id, checked)}
                                                        className="data-[state=checked]:bg-[#3b82f6]"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}