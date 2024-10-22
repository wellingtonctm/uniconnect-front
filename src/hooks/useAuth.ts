import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export function useAuth(){
    try {
        return useContext(AuthContext);

    } catch (error) {
        throw new Error('useAuth must need to using in AuthProvider')
    }
}