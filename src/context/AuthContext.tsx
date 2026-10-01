

// app/context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  username: string
  email: string
  telephone?: string
  photo_profil?: string
  genre?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ 
    success: boolean
    error?: string
    requiresPasswordChange?: boolean 
  }>
  logout: () => void
  updateUser: (user: User) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const USER_STORAGE_KEY = 'assurance-user'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const setSessionTimeout = () => {
    cleanup()
    timeoutRef.current = setTimeout(() => {
      console.log('Session expirée, déconnexion...')
      logout()
      router.push('/login')
    }, SESSION_DURATION)
  }

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
    cleanup()
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    setSessionTimeout()
  }

  const login = async (email: string, password: string) => {
    try {
      // 1. Chercher l'utilisateur par email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (userError || !userData) {
        console.error('User not found:', userError)
        return { 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        }
      }

      // 2. Vérifier le mot de passe
      if (userData.password !== password) {
        console.error('Password mismatch')
        return { 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        }
      }

      // 3. Connexion réussie
      const loggedUser = { ...userData } as User
      setUser(loggedUser)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser))
      setSessionTimeout()

      console.log('Login successful:', {
        email: loggedUser.email,
        username: loggedUser.username
      })

      return { 
        success: true, 
        requiresPasswordChange: false 
      }

    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: 'Erreur de connexion au serveur' 
      }
    }
  }

  // Vérifier la session au chargement
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User
          setUser(userData)
          setSessionTimeout()
          console.log('Session restored for:', userData.email, 'Username:', userData.username)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          logout()
        }
      }
      
      setLoading(false)
    }

    checkAuth()

    return () => {
      cleanup()
    }
  }, [])

  // Rafraîchir le timeout sur activité utilisateur
  useEffect(() => {
    if (!user) return

    const resetTimer = () => {
      cleanup()
      timeoutRef.current = setTimeout(() => {
        console.log('Session timeout - logging out')
        logout()
        router.push('/login')
      }, SESSION_DURATION)
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove']
    events.forEach(event => window.addEventListener(event, resetTimer))

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [user, router])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      updateUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}