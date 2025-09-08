"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivityCard } from "@/components/dashboard/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Users, Clock, CheckCircle, Plus, Eye, Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"
import { dashboardService, type EmployerDashboardStats, type RecentActivity } from "@/lib/dashboard"
import { jobService, type Job } from "@/lib/jobs"
import { companyService, type Company } from "@/lib/company"
import { applicationService, type Application } from "@/lib/applications"

export default function EmployerDashboard() {
  const router = useRouter()
  const user = useMemo(() => authService.getCurrentUser(), [])

  const [stats, setStats] = useState<EmployerDashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== 2) {
      switch (user.role) {
        case 3: router.push("/admin"); break
        case 1: router.push("/dashboard"); break
        default: router.push("/"); break
      }
      return
    }

    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError("")
    try {
      // Fetch all data in parallel
      const [statsData, recentActivities, myJobs, myCompany, applications] = await Promise.all([
        dashboardService.getEmployerStats(),
        dashboardService.getEmployerRecentActivity(),
        jobService.getMyJobs(),
        companyService.getMyCompany(),
        applicationService.getAllApplicationsForEmployer(),
      ])

      setStats(statsData)
      setActivities(recentActivities)
      setActiveJobs(myJobs.filter(job => job.isActive))
      setCompany(myCompany)
      setRecentApplications(applications.slice(0, 5)) // latest 5 applications
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== 2) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
        </div>

        {/* Company Card */}
        {!company ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Your Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You haven't added your company yet. Add it to manage jobs and applications.</p>
              <Button asChild>
                <Link href="/employer/company/new">Add Company</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription>{company.industry} • {company.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{company.description}</p>
              <p className="text-sm mt-2">Employees: {company.employeeCount || "-"}</p>
              {company.website && <p className="text-sm mt-1">Website: <Link href={company.website} className="underline">{company.website}</Link></p>}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Active Jobs" value={stats.activeJobs} description="Currently posted positions" icon={Briefcase} />
            <StatsCard title="Total Applications" value={stats.totalApplications} description="All applications received" icon={Users} />
            <StatsCard title="Pending Review" value={stats.pendingApplications} description="Applications awaiting review" icon={Clock} />
            <StatsCard title="Hired Candidates" value={stats.hiredCandidates} description="Successfully hired" icon={CheckCircle} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for managing your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/employer/jobs/new">
                      <Plus className="h-6 w-6" />
                      <span>Post New Job</span>
                    </Link>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/employer/jobs">
                      <Eye className="h-6 w-6" />
                      <span>View My Jobs</span>
                    </Link>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/employer/applications">
                      <Users className="h-6 w-6" />
                      <span>Review Applications</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivityCard activities={activities} title="Recent Activity" />

            {/* Active Jobs Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Active Jobs</CardTitle>
                <CardDescription>Overview of your currently posted positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Posted {new Date(job.postedDate).toLocaleDateString()} • {job.applicationCount} applications
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/employer/jobs/${job.id}`}>View</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/employer/jobs/${job.id}/applications`}>Review Apps</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {activeJobs.length > 0 && (
                  <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                    <Link href="/employer/jobs">View All Jobs</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest candidates who applied</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentApplications.map(app => (
                  <div key={app.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{app.applicantName}</p>
                      <p className="text-muted-foreground text-xs">Applied for {app.jobTitle}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/employer/applications/${app.id}`}>Review</Link>
                    </Button>
                  </div>
                ))}
                {recentApplications.length > 0 && (
                  <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                    <Link href="/employer/applications">View All Applications</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}