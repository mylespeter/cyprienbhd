// app/admin/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const adminSession = document.cookie.includes('admin-session=authenticated')
    if (adminSession) {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .eq('username', 'admin')
        .single()

      if (userError || !userData) {
        setError('Identifiants invalides')
        setLoading(false)
        return
      }

      if (userData.password !== password) {
        setError('Identifiants invalides')
        setLoading(false)
        return
      }

      document.cookie = 'admin-session=authenticated; path=/; max-age=86400; SameSite=Strict'
      
      localStorage.setItem('admin-user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email
      }))

      router.push('/admin')

    } catch (err) {
      console.error('Login error:', err)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1a3a6b]/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ff6b00]/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-[#1a3a6b] text-white px-4 py-2.5 mb-8">
            <span className="w-2 h-2 bg-[#ff6b00] animate-pulse" />
            <span className="text-sm font-medium tracking-wide uppercase">Administration</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a6b] mb-3">Connexion</h1>
          <p className="text-gray-500 font-medium">Espace réservé aux administrateurs</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-[#1a3a6b] uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:outline-none focus:border-[#ff6b00] transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#1a3a6b] uppercase tracking-wide mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:outline-none focus:border-[#ff6b00] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6b00] text-white px-8 py-4 font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/20 hover:shadow-xl disabled:opacity-50 uppercase tracking-wide"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}