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
    Pass = '@uniconnect_pass'
}

interface ContextProps {
    user: User | null;
    login: (name: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<ContextProps>({} as ContextProps);

interface ContextAdminProps {
    pass: string | null;
    loginAdmin: (name: string) => Promise<void>;
    logoutAdmin: () => Promise<void>;
}

export const AuthAdminContext = createContext<ContextAdminProps>({} as ContextAdminProps);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
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

const AuthAdminProvider = ({ children }: AuthProviderProps) => {
    const [pass, setPass] = useState<string | null>(null);

    const loginAdmin = async (senha: string) => {
        try {
            const { data } = await axios.post('/User/Admin', { senha })
            setPass(senha);
            localStorage.setItem(StorageKeys.Pass, JSON.stringify(data));
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logoutAdmin = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setPass(null);
            localStorage.removeItem(StorageKeys.Pass);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const pass = localStorage.getItem(StorageKeys.Pass)

        console.log(pass)

        return setPass(
            pass
        );
    }, [])

    return (
        <AuthAdminContext.Provider value={{ pass, loginAdmin, logoutAdmin }}>
            {children}
        </AuthAdminContext.Provider>
    );
}

export {AuthProvider, AuthAdminProvider};