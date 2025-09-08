// lib/company.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Company {
  id: number
  userId: number
  name: string
  description?: string
  industry?: string
  location?: string
  website?: string
  logoFileName?: string
  logoFilePath?: string
  employeeCount?: number
  createdAt: string
  updatedAt?: string
}

export interface CreateCompanyData {
  name: string
  description?: string
  industry?: string
  location?: string
  website?: string
  employeeCount?: number
}

export interface UpdateCompanyData {
  name?: string
  description?: string
  industry?: string
  location?: string
  website?: string
  employeeCount?: number
}

class CompanyService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...(options.headers || {}),
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      let errorMessage = "Something went wrong"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = await response.text()
      }
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return {} as T
    }

    return (await response.json()) as T
  }

  // -------------------- Employer methods --------------------
  async getMyCompany(): Promise<Company | null> {
    try {
      return await this.request<Company>(`${API_BASE_URL}/company`)
    } catch (err) {
      return null // return null if no company exists
    }
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.request<Company[]>(`${API_BASE_URL}/company/all`)
  }

  async getCompanyById(id: number): Promise<Company> {
    return this.request<Company>(`${API_BASE_URL}/company/${id}`)
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    return this.request<Company>(`${API_BASE_URL}/company`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCompany(data: UpdateCompanyData): Promise<Company> {
    return this.request<Company>(`${API_BASE_URL}/company`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async uploadLogo(file: File): Promise<Company> {
    const formData = new FormData()
    formData.append("file", file)

    const headers = this.getAuthHeader() // Don't set Content-Type; browser will handle it

    const response = await fetch(`${API_BASE_URL}/company/logo`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      let errorMessage = "Failed to upload logo"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = await response.text()
      }
      throw new Error(errorMessage)
    }

    return (await response.json()) as Company
  }

  async deleteLogo(): Promise<void> {
    await this.request<void>(`${API_BASE_URL}/company/logo`, {
      method: "DELETE",
    })
  }
}

// Export singleton
export const companyService = new CompanyService()
