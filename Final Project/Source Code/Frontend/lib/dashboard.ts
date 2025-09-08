export interface JobSeekerDashboardStats {
  appliedJobs: number
  savedJobs: number
  profileCompleteness: number
  interviewsScheduled: number
}

export interface EmployerDashboardStats {
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  hiredCandidates: number
}

export interface AdminDashboardStats {
  totalUsers: number
  totalJobSeekers: number
  totalEmployers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  totalCompanies: number
  applicationSuccessRate: number
  monthlyStats: MonthlyStats[]
  jobCategoryStats: JobCategoryStats[]
  topCompanies: TopCompany[]
}

export interface MonthlyStats {
  month: number
  year: number
  monthName: string
  newUsers: number
  newJobs: number
  newApplications: number
}

export interface JobCategoryStats {
  category: string
  jobCount: number
  applicationCount: number
}

export interface TopCompany {
  companyId: number
  companyName: string
  jobCount: number
  applicationCount: number
}

export interface RecentActivity {
  id: number
  type: "application" | "job_posted" | "profile_updated" | "interview_scheduled"
  title: string
  description: string
  date: string
  status?: string
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class DashboardService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Job Seeker Dashboard
  async getJobSeekerStats(): Promise<JobSeekerDashboardStats> {
    return {
      appliedJobs: 12,
      savedJobs: 8,
      profileCompleteness: 85,
      interviewsScheduled: 3,
    }
  }

  async getJobSeekerRecentActivity(): Promise<RecentActivity[]> {
    return [
      {
        id: 1,
        type: "application",
        title: "Applied to Software Engineer",
        description: "at TechCorp Inc.",
        date: "2024-01-15T10:30:00Z",
        status: "pending",
      },
      {
        id: 2,
        type: "interview_scheduled",
        title: "Interview Scheduled",
        description: "for Frontend Developer at StartupXYZ",
        date: "2024-01-14T14:00:00Z",
        status: "scheduled",
      },
      {
        id: 3,
        type: "profile_updated",
        title: "Profile Updated",
        description: "Added new skills and experience",
        date: "2024-01-13T09:15:00Z",
      },
    ]
  }

  // Employer Dashboard
  async getEmployerStats(): Promise<EmployerDashboardStats> {
    return {
      activeJobs: 5,
      totalApplications: 47,
      pendingApplications: 23,
      hiredCandidates: 8,
    }
  }

  async getEmployerRecentActivity(): Promise<RecentActivity[]> {
    return [
      {
        id: 1,
        type: "application",
        title: "New Application Received",
        description: "for Senior Developer position",
        date: "2024-01-15T11:20:00Z",
        status: "new",
      },
      {
        id: 2,
        type: "job_posted",
        title: "Job Posted Successfully",
        description: "Marketing Manager position is now live",
        date: "2024-01-14T16:45:00Z",
        status: "active",
      },
    ]
  }

  // Admin Dashboard
  async getAdminStats(): Promise<AdminDashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      } as HeadersInit,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch admin dashboard stats")
    }

    return response.json()
  }

  async getSystemActivity(days = 30): Promise<RecentActivity[]> {
    const response = await fetch(
      `${API_BASE_URL}/admin/activity?days=${days}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        } as HeadersInit,
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch system activity")
    }

    const activities = await response.json()
    return activities.map((activity: any) => ({
      id: activity.id || Math.random(),
      type: "application",
      title: activity.activityType,
      description: activity.description,
      date: activity.date,
      status: activity.userRole,
    }))
  }
}

export const dashboardService = new DashboardService()
