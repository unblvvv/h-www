const BASE_URL = 'http://localhost:8080'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, application/problem+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    let errorData: unknown = null

    if (text) {
      try {
        errorData = JSON.parse(text)
      } catch {
        errorData = text
      }
    }

    const message =
      typeof errorData === 'string'
        ? errorData
        : (errorData as { message?: string; detail?: string })?.message ??
          (errorData as { detail?: string })?.detail ??
          'Щось пішло не так'

    throw new Error(message)
  }

  return res.json()
}