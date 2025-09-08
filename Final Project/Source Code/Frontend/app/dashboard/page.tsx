"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Bookmark, User as UserIcon, Calendar, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { authService, User } from "@/lib/auth"
import { dashboardService, type JobSeekerDashboardStats } from "@/lib/dashboard"
import { applicationService, type Application } from "@/lib/applications"
import { format } from "date-fns"

export default function JobSeekerDashboard() {
  const [stats, setStats] = useState<JobSeekerDashboardStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Map numeric status to text
  const getStatusText = (status: number | string) => {
    switch (status) {
      case 1:
        return "Submitted"
      case 2:
        return "Under Review"
      case 3:
        return "Shortlisted"
      case 4:
        return "InterviewScheduled"
      case 5:
        return "Interviewed"
      case 6:
        return "Rejected"
      
      default:
        return "Unknown"
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    if (currentUser.role !== 1) {
      // Redirect based on role
      switch (currentUser.role) {
        case 2:
          router.push("/employer")
          break
        case 3:
          router.push("/admin")
          break
        default:
          router.push("/")
      }
      return
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError("")
      const [statsData, applicationsData] = await Promise.all([
        dashboardService.getJobSeekerStats(),
        applicationService.getMyApplications(),
      ])
      setStats(statsData)
      setApplications(applicationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== 1) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your job search</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Applications Sent" value={stats.appliedJobs} description="Total job applications" icon={FileText} />
            <StatsCard title="Saved Jobs" value={stats.savedJobs} description="Jobs in your watchlist" icon={Bookmark} />
            <StatsCard title="Profile Complete" value={`${stats.profileCompleteness}%`} description="Profile completion status" icon={UserIcon} />
            <StatsCard title="Interviews" value={stats.interviewsScheduled} description="Scheduled interviews" icon={Calendar} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            {stats && stats.profileCompleteness < 100 && (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Profile</CardTitle>
                  <CardDescription>
                    A complete profile helps employers find you and increases your chances of getting hired
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completion</span>
                      <span>{stats.profileCompleteness}%</span>
                    </div>
                    <Progress value={stats.profileCompleteness} className="h-2" />
                  </div>
                  <Button asChild>
                    <Link href="/profile">Complete Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to help you in your job search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/jobs"><Search className="h-6 w-6" /><span>Browse Jobs</span></Link>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/profile"><UserIcon className="h-6 w-6" /><span>Update Profile</span></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Real Applications */}
            {applications.length > 0 ? (
              applications.map(app => (
                <Card key={app.id}>
                  <CardHeader>
                    <CardTitle>{app.jobTitle} @ {app.companyName}</CardTitle>
                    <CardDescription>
                      Applied on: {format(new Date(app.appliedDate), "PPP")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Status:</strong> {getStatusText(app.status)}</p>
                    {app.interviewDate && (
                      <p><strong>Interview Date:</strong> {format(new Date(app.interviewDate), "PPP, p")}</p>
                    )}
                    <Button variant="outline" asChild>
                      <Link href={`/applications/${app.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No applications yet.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Jobs that match your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">Senior Frontend Developer</h4>
                    <p className="text-xs text-muted-foreground">TechCorp Inc. • Remote</p>
                    <p className="text-xs text-muted-foreground mt-1">$80k - $120k</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">Full Stack Engineer</h4>
                    <p className="text-xs text-muted-foreground">StartupXYZ • New York</p>
                    <p className="text-xs text-muted-foreground mt-1">$90k - $130k</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">React Developer</h4>
                    <p className="text-xs text-muted-foreground">WebCorp • San Francisco</p>
                    <p className="text-xs text-muted-foreground mt-1">$100k - $140k</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                  <Link href="/jobs">View All Recommendations</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Job Search Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Job Search Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Optimize your profile</p>
                  <p className="text-muted-foreground text-xs">Add relevant skills and experience to attract more employers</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Set up job alerts</p>
                  <p className="text-muted-foreground text-xs">Get notified when new jobs match your criteria</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Follow up on applications</p>
                  <p className="text-muted-foreground text-xs">Check application status and follow up when appropriate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
