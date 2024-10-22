"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/hooks/useAuth"
import { useSearchParams } from "react-router-dom"

const schemaLogin = z.object({
    nome: z.string().min(1, { message: 'Nome é obrigatório' })
})

type LoginSchemaProps = z.infer<typeof schemaLogin>;

export function LoginModal() {

    const { login } = useAuth()

    const [searchParams, setSearchParams] = useSearchParams()

    const { register, handleSubmit, reset, formState: {  isSubmitting } } = useForm<LoginSchemaProps>({
        resolver: zodResolver(schemaLogin),
    })


    function handleClose(){
        searchParams.delete('modalLogin')
        setSearchParams(searchParams)

    }


    const handleLogin = async (data: LoginSchemaProps) => {
        await login(data.nome)
        reset()
        handleClose()
    }

    const isOpen = searchParams.get('modalLogin') ===  'open'

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} >

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Identifique-se</DialogTitle>
                    <DialogDescription>
                        Digite seu nome para enviar a mensagem
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                {...register('nome')}
                                id="name"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting} >Login</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}