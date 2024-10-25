'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Search, ChevronRight } from "lucide-react"
import axios from '@/lib/axios'

interface Event {
    id: number
    description: string
    layoutNumberCols: number
    createdAt: string
    enabled: boolean
    usersNumber: number
    messagesNumber: number
}

interface UpdateEventDto {
    id: number
    description: string
    layoutNumberCols: number
    enabled: boolean
}

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([])
    const [filter, setFilter] = useState('')
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const fetchEvents = () => {
        axios.get(`/Event`).then((data) => {
            const events: Event[] = [...data.data];
            setEvents([...events]);
        });
    }

    const toggleEventStatus = (id: number, checked: boolean) => {
        axios.put(`/Event/${checked ? 'Enable' : 'Disable'}/${id}`).then(() => {
            fetchEvents();
        });
    }

    const handleEditName = (newName: string) => {
        if (editingEvent !== null) {
            const data: UpdateEventDto = {
                description: newName,
                enabled: editingEvent.enabled,
                id: editingEvent.id,
                layoutNumberCols: editingEvent.layoutNumberCols
            };

            axios.put(`/Event`, data).then(() => {
                setEditingEvent(null);
                fetchEvents();
            });
        }
    };

    const filteredEvents = events.filter(event =>
        event.description.toLowerCase().includes(filter.toLowerCase())
    )

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className='w-screen h-screen bg-[#0a0a0a]'>
            <div className="container mx-auto p-4 text-[#e4e4e7] min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-[#e4e4e7]">Gerenciamento de Eventos</h1>
                <div className="flex items-center mb-6">
                    <Input
                        type="text"
                        placeholder="Buscar eventos..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                                <TableHead className="text-[#a1a1aa]">Nome do Evento</TableHead>
                                <TableHead className="text-[#a1a1aa]">Status</TableHead>
                                <TableHead className="text-[#a1a1aa]">Usuários</TableHead>
                                <TableHead className="text-[#a1a1aa]">Mensagens</TableHead>
                                <TableHead className="text-[#a1a1aa]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => (
                                <TableRow key={event.id} className="border-b border-[#27272a]">
                                    <TableCell className="font-medium text-[#e4e4e7]">
                                        {editingEvent?.id === event.id ? (
                                            <Input
                                                value={event.description}
                                                onChange={(e) => {
                                                    const updatedEvents = events.map(ev =>
                                                        ev.id === event.id ? { ...ev, description: e.target.value } : ev
                                                    );
                                                    setEvents(updatedEvents);
                                                }}
                                                onBlur={() => handleEditName(event.description)}
                                                className="bg-[#27272a] text-[#e4e4e7] border-[#3b82f6]"
                                                autoFocus
                                            />
                                        ) : (
                                            <span onClick={() => setEditingEvent(event)} className="cursor-pointer hover:underline">
                                                {event.description}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={event.enabled}
                                            onCheckedChange={(checked: boolean) => toggleEventStatus(event.id, checked)}
                                            className="data-[state=checked]:bg-[#3b82f6]"
                                        />
                                    </TableCell>
                                    <TableCell className="text-[#a1a1aa]">{event.usersNumber}</TableCell>
                                    <TableCell className="text-[#a1a1aa]">{event.messagesNumber}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="text-[#3b82f6] hover:text-[#60a5fa] hover:bg-[#27272a]">
                                            Detalhes <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}