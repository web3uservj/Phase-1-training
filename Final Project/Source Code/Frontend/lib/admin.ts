export interface UserManagement {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: "JobSeeker" | "Employer" | "Admin"
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
  jobPostCount?: number
  applicationCount?: number
  companyName?: string
}

export interface UpdateUserStatusData {
  isActive: boolean
  reason?: string
}

export interface JobModeration {
  id: number
  title: string
  description: string
  location?: string
  companyName: string
  postedByName: string
  postedDate: string
  isActive: boolean
  applicationCount: number
  reportCount: number
  requiresReview: boolean
}

export interface SystemActivity {
  date: string
  activityType: string
  description: string
  userEmail: string
  userRole: string
}

export interface Report {
  reportType: string
  generatedAt: string
  data: Record<string, any>
}

export interface SystemReport {
  totalUsers: number
  newUsersThisMonth: number
  activeJobs: number
  newJobsThisMonth: number
  totalApplications: number
  newApplicationsThisMonth: number
  successRate: number // as percentage
}


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class AdminService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // User Management
  async getAllUsers(): Promise<UserManagement[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return response.json()
  }

  async updateUserStatus(
    userId: number,
    data: UpdateUserStatusData,
  ): Promise<UserManagement> {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update user status")
    }

    return response.json()
  }

  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        ...this.getAuthHeader(),
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete user")
    }
  }

  // Job Moderation
  async getJobsForModeration(): Promise<JobModeration[]> {
    const response = await fetch(`${API_BASE_URL}/admin/jobs/moderation`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch jobs for moderation")
    }

    return response.json()
  }

  async approveJob(jobId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/admin/jobs/${jobId}/approve`,
      {
        method: "POST",
        headers: {
          ...this.getAuthHeader(),
        },
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to approve job")
    }
  }

  async rejectJob(jobId: number, reason: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/admin/jobs/${jobId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ reason }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to reject job")
    }
  }

  // Reports
  async generateUserReport(
    startDate: string,
    endDate: string,
  ): Promise<Report> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/users?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to generate user report")
    }

    return response.json()
  }

  async generateJobReport(
    startDate: string,
    endDate: string,
  ): Promise<Report> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/jobs?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to generate job report")
    }

    return response.json()
  }

  async generateApplicationReport(
    startDate: string,
    endDate: string,
  ): Promise<Report> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/applications?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to generate application report")
    }

    return response.json()
  }
  // System Reports
async getSystemReports(): Promise<SystemReport> {
  const response = await fetch(`${API_BASE_URL}/admin/reports/system`, {
    headers: {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch system reports")
  }

  return response.json()
}


  // System Activity
  async getSystemActivity(days = 30): Promise<SystemActivity[]> {
    const response = await fetch(
      `${API_BASE_URL}/admin/activity?days=${days}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch system activity")
    }

    return response.json()
  }
}

export const adminService = new AdminService()