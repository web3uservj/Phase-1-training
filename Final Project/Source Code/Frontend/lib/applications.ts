// -------------------- Interfaces --------------------
export interface Application {
  id: number
  jobId: number
  jobTitle: string
  companyName: string
  applicantId: number
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  status:
    | "Submitted"
    | "UnderReview"
    | "Shortlisted"
    | "Interviewed"
    | "Offered"
    | "Hired"
    | "Rejected"
  appliedDate: string
  reviewedDate?: string
  reviewNotes?: string
  interviewDate?: string
  interviewNotes?: string
}

export interface CreateApplicationData {
  jobId: number
  coverLetter?: string
}

export interface UpdateApplicationStatusData {
  status: Application["status"]
  reviewNotes?: string
  interviewDate?: string
  interviewNotes?: string
}

// -------------------- Service --------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApplicationService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
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

    // some DELETE requests may have no body
    if (response.status === 204) {
      return {} as T
    }

    return (await response.json()) as T
  }

  // -------------------- Job Seeker methods --------------------
  async createApplication(
    data: CreateApplicationData
  ): Promise<Application> {
    return this.request<Application>(`${API_BASE_URL}/applications`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getMyApplications(): Promise<Application[]> {
    return this.request<Application[]>(
      `${API_BASE_URL}/applications/my-applications`
    )
  }

  async getApplicationById(id: number): Promise<Application> {
    return this.request<Application>(`${API_BASE_URL}/applications/${id}`)
  }

  async withdrawApplication(id: number): Promise<void> {
    await this.request<void>(`${API_BASE_URL}/applications/${id}`, {
      method: "DELETE",
    })
  }

  async hasApplied(jobId: number): Promise<boolean> {
    const result = await this.request<{ hasApplied: boolean }>(
      `${API_BASE_URL}/applications/check/${jobId}`
    )
    return result.hasApplied
  }

  async getApplicationCountForJob(jobId: number): Promise<number> {
    const result = await this.request<{ applicationCount: number }>(
      `${API_BASE_URL}/applications/job/${jobId}/count`
    )
    return result.applicationCount
  }

  // -------------------- Employer methods --------------------
  async getApplicationsForJob(jobId: number): Promise<Application[]> {
    return this.request<Application[]>(
      `${API_BASE_URL}/applications/job/${jobId}`
    )
  }

  async getAllApplicationsForEmployer(): Promise<Application[]> {
    return this.request<Application[]>(`${API_BASE_URL}/applications/employer`)
  }

  async updateApplicationStatus(
    id: number,
    data: UpdateApplicationStatusData
  ): Promise<Application> {
    return this.request<Application>(
      `${API_BASE_URL}/applications/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
  }
}

// -------------------- Export Singleton --------------------
export const applicationService = new ApplicationService()
