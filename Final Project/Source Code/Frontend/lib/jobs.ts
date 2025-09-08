const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Job {
  id: number
  title: string
  description: string
  requirements: string
  location?: string
  minSalary?: number
  maxSalary?: number
  jobType: number           // numeric enum
  experienceLevel: number   // numeric enum
  category?: string
  isActive: boolean
  postedDate: string
  applicationDeadline?: string
  companyName: string
  companyLocation: string
  applicationCount: number
}

export interface CreateJobPayload {
  title: string
  description: string
  requirements: string
  location?: string
  minSalary?: number
  maxSalary?: number
  jobType: number           // numeric enum
  experienceLevel: number   // numeric enum
  category?: string
  applicationDeadline?: string
  isActive: boolean
}

export interface JobSearchFilters {
  title?: string
  location?: string
  category?: string
  jobType?: number
  experienceLevel?: number
  minSalary?: number
  maxSalary?: number
  page?: number
  pageSize?: number
}

class JobService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async getAllJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch jobs")
    return response.json()
  }

  async getJobById(id: number): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Job not found")
    return response.json()
  }

  async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })
    if (!response.ok) throw new Error("Failed to search jobs")
    return response.json()
  }

  async getJobsByCompany(companyId: number): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch company jobs")
    return response.json()
  }

  async getMyJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/my-jobs`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
    })
    if (!response.ok) throw new Error("Failed to fetch your jobs")
    return response.json()
  }

  async createJob(jobData: CreateJobPayload): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create job")
    }

    return response.json()
  }

  async updateJob(id: number, jobData: Partial<CreateJobPayload>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update job")
    }

    return response.json()
  }

  async deleteJob(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: { ...this.getAuthHeader() },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete job")
    }
  }
}

export const jobService = new JobService()
