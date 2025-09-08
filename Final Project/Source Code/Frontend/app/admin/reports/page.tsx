"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Users, Briefcase, TrendingUp, ArrowLeft, Download } from "lucide-react"
import { authService } from "@/lib/auth"
import { adminService, type Report } from "@/lib/admin"
import Link from "next/link"

export default function AdminReportsPage() {
  const [userReport, setUserReport] = useState<Report | null>(null)
  const [jobReport, setJobReport] = useState<Report | null>(null)
  const [appReport, setAppReport] = useState<Report | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const [user, setUser] = useState<any>(null) // use proper User type here if available

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== 3) {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (!user) return

    const loadReports = async () => {
      try {
        setIsLoading(true)
        setError("")

        const today = new Date()
        const past30Days = new Date()
        past30Days.setDate(today.getDate() - 30)
        const startDate = past30Days.toISOString().split('T')[0]
        const endDate = today.toISOString().split('T')[0]

        const [uReport, jReport, aReport] = await Promise.all([
          adminService.generateUserReport(startDate, endDate),
          adminService.generateJobReport(startDate, endDate),
          adminService.generateApplicationReport(startDate, endDate),
        ])

        setUserReport(uReport)
        setJobReport(jReport)
        setAppReport(aReport)
      } catch (err: any) {
        setError(err.message || "Failed to load reports")
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [user])

  if (!user) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Download className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
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

        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">System Reports</h1>
              <p className="text-muted-foreground">View detailed system analytics and reports</p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Reports</TabsTrigger>
            <TabsTrigger value="jobs">Job Reports</TabsTrigger>
            <TabsTrigger value="applications">Application Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userReport?.data?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">+{userReport?.data?.newUsersThisMonth || 0} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobReport?.data?.activeJobs || 0}</div>
                  <p className="text-xs text-muted-foreground">+{jobReport?.data?.newJobsThisMonth || 0} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appReport?.data?.totalApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">+{appReport?.data?.newApplicationsThisMonth || 0} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userReport?.data?.successRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">Applications to hires</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User analytics and demographics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Job posting analytics and trends will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Application Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Application analytics and conversion rates will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
