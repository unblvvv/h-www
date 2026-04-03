import { useState } from 'react'
import { authApi } from '../api/auth'
import type { RegisterDto } from './types'

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: RegisterDto) => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await authApi.register(data)

      const token = res.token
      if (token) {
        localStorage.setItem('token', token)
      }

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Помилка реєстрації')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}