import { instance } from '@/shared/lib/api.config';
import type { LoginDto, RegisterDto, AuthResponse } from '../model/types';
import type { UserProfile } from '@/shared/types/user';

const AUTH_BASE = '/v1/auth';

export const authApi = {
    register: (data: RegisterDto) =>
        instance.post<AuthResponse>(`${AUTH_BASE}/register`, data),
    login: (data: LoginDto) =>
        instance.post<AuthResponse>(`${AUTH_BASE}/login`, data),
    refreshToken: () =>
        instance.get<AuthResponse>(`${AUTH_BASE}/refresh`),
    logout: () =>
        instance.post(`${AUTH_BASE}/logout`),
    getMe: () =>
        instance.get<UserProfile>(`${AUTH_BASE}/profile`),
};