'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { LoginModal } from './login'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'react-router-dom'
import axios from '@/lib/axios'

type Message = {
    id: number
    text: string
    timestamp: string
}

const schemaMessage = z.object({
    message: z.string().min(1, { message: 'Messagem muito curta' }).max(100, { message: 'Mensagem muito longa' })
})

type MessageSchemaProps = z.infer<typeof schemaMessage>;

export default function FormMessagey() {
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageSchemaProps>({
        resolver: zodResolver(schemaMessage),
    })
    const [messages, setMessages] = useState<Message[]>([])

    const handleSend = async (data: MessageSchemaProps) => {
        if (!data.message.trim()) return

        if (!user?.id) {
            searchParams.set('modalLogin', 'open')
            setSearchParams(searchParams)
            return
        }

        if (data.message.trim()) {
            await axios.post('/Message', {
                "userId": user.id,
                "content": data.message
            })
            setMessages([...messages, { id: messages.length + 1, text: data.message, timestamp: new Date().toLocaleString('pt-BR') }])
            reset()
        }
    }

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className="flex flex-col h-screen bg-background">
                {/* Cabeçalho fixo */}
                <header className="flex items-center justify-between bg-zinc-800 text-primary-foreground p-5 fixed top-0 left-0 right-0 z-10">
                    <h1 className="text-xl font-bold">UNijovem</h1>
                    <div>@{user?.name}</div>
                </header>

                {/* Área de mensagens com rolagem */}
                <ScrollArea 
                    className="flex-grow p-4 bg-secondary-foreground mt-[72px] mb-[96px] overflow-y-auto"
                    ref={scrollAreaRef}
                >
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="flex flex-col items-end">
                                <div className="max-w-[70%] rounded-lg p-3 bg-zinc-700 text-primary-foreground">
                                    {message.text}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                </ScrollArea>

                {/* Área de input fixo */}
                <div className="p-4 border-t bg-primary border-primary/50 fixed bottom-0 left-0 right-0 z-10">
                    <form className="flex space-x-2 items-end" onSubmit={handleSubmit(handleSend)}>
                        <div className='flex-1 space-y-2'>
                            <Textarea
                                {...register('message')}
                                placeholder="Digite uma mensagem"
                                className="flex-grow bg-primary border-primary-foreground/20 text-primary-foreground/80"
                            />
                            {errors.message?.message && <p className='text-red-600'>{errors.message?.message}</p>}
                        </div>
                        <Button size="icon" className='border-primary-foreground/20'>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </div>
            <LoginModal />
        </>
    )
}
