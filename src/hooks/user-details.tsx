import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, EyeOff, Trash2, ArrowLeft } from "lucide-react"

export default function UserDetails() {
  const [user, setUser] = useState({
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    blocked: false,
    totalMessages: 15
  })

  const [messages, setMessages] = useState([
    { id: 1, content: 'Ótimo evento!', timestamp: '2023-05-15 10:30', hidden: false },
    { id: 2, content: 'Quando será o próximo?', timestamp: '2023-05-15 11:45', hidden: false },
    { id: 3, content: 'Parabéns aos organizadores!', timestamp: '2023-05-15 14:20', hidden: true  },
  ])

  const [messageFilter, setMessageFilter] = useState('')

  const toggleUserBlock = () => {
    setUser(prevUser => ({ ...prevUser, blocked: !prevUser.blocked }))
  }

  const toggleMessageVisibility = (id: number) => {
    setMessages(prevMessages => prevMessages.map(message => 
      message.id === id ? { ...message, hidden: !message.hidden } : message
    ))
  }

  const deleteMessage = (id: number) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id))
    setUser(prevUser => ({ ...prevUser, totalMessages: prevUser.totalMessages - 1 }))
  }

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(messageFilter.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 bg-[#0a0a0a] text-[#e4e4e7] min-h-screen">
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
              <p>{user.name}</p>
            </div>
            <div>
              <p className="font-semibold text-[#e4e4e7]">Email:</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="font-semibold text-[#e4e4e7]">Status:</p>
              <Badge variant={user.blocked ? "destructive" : "success"} className="mt-1">
                {user.blocked ? 'Bloqueado' : 'Ativo'}
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-[#e4e4e7]">Total de Mensagens:</p>
              <p>{user.totalMessages}</p>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" onClick={toggleUserBlock} className="bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46] border-[#3f3f46]">
              {user.blocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'}
            </Button>
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
              <TableHead className="text-[#a1a1aa]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={message.id} className="border-b border-[#27272a]">
                <TableCell className="text-[#e4e4e7]">{message.content}</TableCell>
                <TableCell className="text-[#a1a1aa]">{message.timestamp}</TableCell>
                <TableCell>
                  <Switch
                    checked={!message.hidden}
                    onCheckedChange={() => toggleMessageVisibility(message.id)}
                    className="data-[state=checked]:bg-[#3b82f6]"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => toggleMessageVisibility(message.id)} className="text-[#3b82f6] hover:text-[#60a5fa] hover:bg-[#27272a]">
                    <EyeOff className="mr-2 h-4 w-4" />
                    {message.hidden ? 'Mostrar' : 'Ocultar'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)} className="text-red-500 hover:text-red-400 hover:bg-[#27272a]">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}