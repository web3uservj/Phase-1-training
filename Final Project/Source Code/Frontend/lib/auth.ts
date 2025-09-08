export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: number
  isActive: boolean
  createdAt: string
}
export enum UserRole {
  JobSeeker = 1,
  Employer = 2,
  Admin = 3,
}
export interface AuthResponse {
  token: string
  user: User
  expiresAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  role: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class AuthService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const result: AuthResponse = await response.json()
    localStorage.setItem("token", result.token)
    localStorage.setItem("user", JSON.stringify(result.user))
    return result
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    const result: AuthResponse = await response.json()
    localStorage.setItem("token", result.token)
    localStorage.setItem("user", JSON.stringify(result.user))
    return result
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    return userStr ? (JSON.parse(userStr) as User) : null
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const authService = new AuthService()
