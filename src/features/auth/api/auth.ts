import { apiRequest } from '@/shared/lib/api'
import type { RegisterDto, LoginDto, AuthResponse } from '../model/types'

export const authApi = {
  register: (data: RegisterDto) =>
    apiRequest<AuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: LoginDto) =>
    apiRequest<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}