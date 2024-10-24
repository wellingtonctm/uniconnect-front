import { useState } from 'react'
import { Search, Filter, MoreVertical, Archive, Trash2, Mail } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Mensagem = {
  id: number
  remetente: string
  assunto: string
  conteudo: string
  data: string
  lida: boolean
}

const mensagensIniciais: Mensagem[] = [
  { id: 1, remetente: "João Silva", assunto: "Reunião de equipe", conteudo: "Olá, vamos ter uma reunião...", data: "2023-10-23", lida: false },
  { id: 2, remetente: "Maria Souza", assunto: "Relatório mensal", conteudo: "Segue em anexo o relatório...", data: "2023-10-22", lida: true },
  { id: 3, remetente: "Carlos Oliveira", assunto: "Novo projeto", conteudo: "Temos uma nova oportunidade...", data: "2023-10-21", lida: false },
]

export function GestaoMensagensComponent() {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensIniciais)
  const [filtro, setFiltro] = useState<'todas' | 'lidas' | 'nao-lidas'>('todas')
  const [pesquisa, setPesquisa] = useState('')

  const mensagensFiltradas = mensagens
    .filter(msg => {
      if (filtro === 'lidas') return msg.lida
      if (filtro === 'nao-lidas') return !msg.lida
      return true
    })
    .filter(msg =>
      msg.assunto.toLowerCase().includes(pesquisa.toLowerCase()) ||
      msg.remetente.toLowerCase().includes(pesquisa.toLowerCase())
    )

  const marcarComoLida = (id: number) => {
    setMensagens(mensagens.map(msg =>
      msg.id === id ? { ...msg, lida: true } : msg
    ))
  }

  const arquivarMensagem = (id: number) => {
    setMensagens(mensagens.filter(msg => msg.id !== id))
  }

  const excluirMensagem = (id: number) => {
    setMensagens(mensagens.filter(msg => msg.id !== id))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gestão de Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar mensagens..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filtro} onValueChange={(value: 'todas' | 'lidas' | 'nao-lidas') => setFiltro(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar mensagens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as mensagens</SelectItem>
              <SelectItem value="lidas">Mensagens lidas</SelectItem>
              <SelectItem value="nao-lidas">Mensagens não lidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {mensagensFiltradas.map((mensagem) => (
            <div key={mensagem.id} className={`p-4 rounded-lg border ${mensagem.lida ? 'bg-muted' : 'bg-card'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{mensagem.remetente}</h3>
                  <p className="text-sm text-muted-foreground">{mensagem.assunto}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{mensagem.data}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!mensagem.lida && (
                        <DropdownMenuItem onClick={() => marcarComoLida(mensagem.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Marcar como lida</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => arquivarMensagem(mensagem.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arquivar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => excluirMensagem(mensagem.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="mt-2 text-sm">{mensagem.conteudo}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}