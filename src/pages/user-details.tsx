'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, ArrowLeft } from "lucide-react"
import { useParams } from 'react-router-dom'
import axios from '@/lib/axios'

interface User {
    id: number
    eventId: number
    name: string
    createdAt: string
    enabled: boolean
    messagesNumber: number
}

interface Message {
    id: number
    userId: number
    userName: string
    content: string
    sentAt: string
    enabled: boolean
}

export default function UserDetails() {
    const { id } = useParams<{ id: string }>()

    const [user, setUser] = useState<User>()

    const fetchUser = () => {
        axios.get(`/User/${id}`).then((data) => {
            const user: User = { ...data.data };
            setUser(user);

            axios.get(`/User/${id}/Messages`).then((data) => {
                const messages: Message[] = [...data.data];
                setMessages([...messages]);
            });
        });
    }

    const [messages, setMessages] = useState<Message[]>([])

    const [messageFilter, setMessageFilter] = useState('')

    const toggleUserBlock = () => {
        // setUser(prevUser => ({ ...prevUser, blocked: !prevUser.blocked }))
    }

    const toggleMessageVisibility = (id: number, checked: boolean) => {
        axios.put(`/Message/${checked ? 'Enable' : 'Disable'}/${id}`).then(() => {
            fetchUser();
        });
    }

    const filteredMessages = messages.filter(message =>
        message.content.toLowerCase().includes(messageFilter.toLowerCase())
    )

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <div className='w-screen h-screen bg-[#0a0a0a]'>
            <div className="container mx-auto p-4 text-[#e4e4e7] min-h-screen">
                {user && <>
                    <Button variant="ghost" className="mb-6 text-[#3b82f6] hover:text-[#60a5fa] hover:bg-[#27272a]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para lista de usuários
                    </Button>

                    <Card className="mb-8 bg-[#18181b] border-[#27272a]">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#e4e4e7]">Detalhes do Usuário</CardTitle>
                            <CardDescription className="text-[#a1a1aa]">Gerencie as informações e mensagens do usuário</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#a1a1aa]">
                                <div>
                                    <p className="font-semibold text-[#e4e4e7]">Nome:</p>
                                    <p>{user?.name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#e4e4e7]">Status:</p>
                                    <Badge variant={user?.enabled ? "secondary" : "destructive"} className="mt-1">
                                        {user?.enabled ? 'Ativo' : 'Bloqueado'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#e4e4e7]">Total de Mensagens:</p>
                                    <p>{user?.messagesNumber}</p>
                                </div>
                                <div className="">
                                    <Button variant="outline" onClick={toggleUserBlock} className="bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46] border-[#3f3f46]">
                                        {user?.enabled ? 'Bloquear Usuário' : 'Desbloquear Usuário'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-2xl font-bold mb-6 text-[#e4e4e7]">Mensagens do Usuário</h2>
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
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-[#27272a]">
                                    <TableHead className="text-[#a1a1aa]">Mensagem</TableHead>
                                    <TableHead className="text-[#a1a1aa]">Data/Hora</TableHead>
                                    <TableHead className="text-[#a1a1aa]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMessages.map((message) => (
                                    <TableRow key={message.id} className="border-b border-[#27272a]">
                                        <TableCell className="text-[#e4e4e7]">{message.content}</TableCell>
                                        <TableCell className="text-[#a1a1aa]">{new Date(message.sentAt).toLocaleString('pt-BR')}</TableCell>
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
                    </div>
                </>
                }
            </div>
        </div>
    )
}