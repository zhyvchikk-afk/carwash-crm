import { createContext, useContext, useEffect, useState } from "react";

import api from '../api/axios'


const AuthContext = createContext(null)


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    async function loadUser() {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            setIsLoading(false)
            return
        }

        try {
            const response = await api.get('/auth/me/')
            setUser(response.data)
        } catch (error) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    async function login(username, password) {
        const response = await api.post('/auth/login/', {
            username,
            password,
        })

        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        
        await loadUser()
    }

    async function register(data) {
        await api.post('/auth/register/', data)

        await login(data.username, data.password)
    }

    function logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
    }


    useEffect(() => {
        loadUser()
    }, [])

    const value = {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}