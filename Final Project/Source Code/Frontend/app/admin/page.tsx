"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivityCard } from "@/components/dashboard/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Briefcase, Building, TrendingUp, Shield, BarChart3, Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"
import { dashboardService, type AdminDashboardStats, type RecentActivity } from "@/lib/dashboard"
import Link from "next/link"
import type { User } from "@/lib/auth"

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Client-only: safe to use localStorage here
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== 3) {
      if (currentUser.role === 2) router.push("/employer")
      else if (currentUser.role === 1) router.push("/dashboard")
      else router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError("")

        const [statsData, activitiesData] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getSystemActivity(),
        ])

        setStats(statsData)
        setActivities(activitiesData)
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (!user) {
    // Wait until user is loaded on client
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading admin dashboard...</span>
          </div>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management tools</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Users" value={stats.totalUsers} description="All registered users" icon={Users} />
            <StatsCard
              title="Active Jobs"
              value={stats.activeJobs}
              description="Currently posted jobs"
              icon={Briefcase}
            />
            <StatsCard
              title="Companies"
              value={stats.totalCompanies}
              description="Registered companies"
              icon={Building}
            />
            <StatsCard
              title="Success Rate"
              value={`${stats.applicationSuccessRate}%`}
              description="Application success rate"
              icon={TrendingUp}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Tools</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                    <Link href="/admin/users">
                      <Users className="h-6 w-6" />
                      <span>Manage Users</span>
                    </Link>
                  </Button>
                  <Button
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/jobs">
                      <Shield className="h-6 w-6" />
                      <span>Moderate Jobs</span>
                    </Link>
                  </Button>
                  <Button
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/reports">
                      <BarChart3 className="h-6 w-6" />
                      <span>View Reports</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Overview */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Key metrics and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalJobSeekers}</div>
                      <div className="text-sm text-muted-foreground">Job Seekers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.totalEmployers}</div>
                      <div className="text-sm text-muted-foreground">Employers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalApplications}</div>
                      <div className="text-sm text-muted-foreground">Total Applications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <RecentActivityCard activities={activities} title="System Activity" />

            {/* Quick Stats */}
            {stats?.monthlyStats?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>New Users</span>
                    <span className="font-medium">{stats.monthlyStats[0].newUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>New Jobs</span>
                    <span className="font-medium">{stats.monthlyStats[0].newJobs}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Applications</span>
                    <span className="font-medium">{stats.monthlyStats[0].newApplications}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            {stats?.topCompanies && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Companies</CardTitle>
                  <CardDescription>Most active employers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topCompanies.slice(0, 5).map(company => (
                      <div key={company.companyId} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{company.companyName}</p>
                          <p className="text-muted-foreground text-xs">{company.jobCount} jobs posted</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{company.applicationCount} apps</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
