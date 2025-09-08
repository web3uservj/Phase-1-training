export interface JobSeekerProfile {
  id: number
  userId: number
  summary?: string
  skills?: string
  education?: string
  experience?: string
  resumeFileName?: string
  resumeFilePath?: string
  location?: string
  expectedSalary?: number
  createdAt: string
  updatedAt?: string
}

export interface CreateJobSeekerProfileData {
  summary?: string
  skills?: string
  education?: string
  experience?: string
  location?: string
  expectedSalary?: number
}

export interface UpdateJobSeekerProfileData {
  summary?: string
  skills?: string
  education?: string
  experience?: string
  location?: string
  expectedSalary?: number
}

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

export interface FileUploadResult {
  fileName: string
  filePath: string
  fileSize: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ProfileService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Job Seeker Profile methods
  async getJobSeekerProfile(): Promise<JobSeekerProfile> {
    const response = await fetch(`${API_BASE_URL}/jobSeekerprofile`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
    })

    if (!response.ok) {
      throw new Error("Profile not found")
    }

    return response.json()
  }

  async createJobSeekerProfile(
    data: CreateJobSeekerProfileData,
  ): Promise<JobSeekerProfile> {
    const response = await fetch(`${API_BASE_URL}/jobSeekerprofile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create profile")
    }

    return response.json()
  }

  async updateJobSeekerProfile(
    data: UpdateJobSeekerProfileData,
  ): Promise<JobSeekerProfile> {
    const response = await fetch(`${API_BASE_URL}/jobSeekerprofile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update profile")
    }

    return response.json()
  }

  async uploadResume(file: File): Promise<JobSeekerProfile> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/jobSeekerprofile/resume`, {
      method: "POST",
      headers: this.getAuthHeader() as HeadersInit,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to upload resume")
    }

    return response.json()
  }

  async deleteResume(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobSeekerprofile/resume`, {
      method: "DELETE",
      headers: this.getAuthHeader() as HeadersInit,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete resume")
    }
  }

  // Company Profile methods (for employers)
  async getCompanyProfile(): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/company`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
    })

    if (!response.ok) {
      throw new Error("Company profile not found")
    }

    return response.json()
  }

  async createCompanyProfile(data: CreateCompanyData): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create company profile")
    }

    return response.json()
  }

  async updateCompanyProfile(data: UpdateCompanyData): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/company`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update company profile")
    }

    return response.json()
  }

  async uploadCompanyLogo(file: File): Promise<Company> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/company/logo`, {
      method: "POST",
      headers: this.getAuthHeader() as HeadersInit,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to upload logo")
    }

    return response.json()
  }

  async deleteCompanyLogo(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/company/logo`, {
      method: "DELETE",
      headers: this.getAuthHeader() as HeadersInit,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete logo")
    }
  }

  async getAllCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/company/all`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch companies")
    }

    return response.json()
  }

  async getCompanyById(id: number): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/company/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Company not found")
    }

    return response.json()
  }
}

export const profileService = new ProfileService()
