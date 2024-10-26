import axios from "@/lib/axios";
import { createContext, useState, ReactNode, useEffect } from "react";

export interface User {
    id: number
    eventId: number
    event: Event
    name: string
    createdAt: string
    enabled: boolean
}

export interface Event {
    id: number
    description: string
    createdAt: string
    enabled: boolean
}

enum StorageKeys {
    User = '@uniconnect_user',
}

interface ContextProps {
    user: User | null;
    login: (name: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<ContextProps>({} as ContextProps);


interface AuthProviderProps {
    children: ReactNode;
}

export function  AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (name: string) => {
        try {
            const { data } = await axios.post('/User', { name })
            setUser(data);
            localStorage.setItem(StorageKeys.User, JSON.stringify(data));
        } catch (error) {
            console.error("Login failed:", error);
        }
    };


    useEffect(() => {

        const user = localStorage.getItem(StorageKeys.User)

        return setUser(
            JSON.parse(user || '{}') || null
        );

    }, [])

    const logout = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser(null);
            localStorage.removeItem(StorageKeys.User);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}