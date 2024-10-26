import { AuthAdminContext, AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export function useAuth(){
    try {
        return useContext(AuthContext);

    } catch (error) {
        throw new Error('useAuth must need to using in AuthProvider')
    }
}

export function useAuthAdmin(){
    try {
        return useContext(AuthAdminContext);

    } catch (error) {
        throw new Error('useAuth must need to using in AuthAdminProvider')
    }
}