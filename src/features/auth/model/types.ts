export interface RegisterDto {
  email: string
  password: string
  username: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  token?: string
  user?:
    | {
        name: string
        email: string
        phone?: string
      }
    | string
}