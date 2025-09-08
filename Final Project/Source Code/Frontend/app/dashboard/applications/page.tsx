"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { ApplicationCard } from "@/components/applications/application-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText } from "lucide-react"
import { authService } from "@/lib/auth"
import { applicationService, type Application } from "@/lib/applications"
import Link from "next/link"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawing, setIsWithdrawing] = useState<number | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const user = authService.getCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== 1) {
      router.push("/")
      return
    }

    loadApplications()
  }, [user, router])

  const loadApplications = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await applicationService.getMyApplications()
      setApplications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async (applicationId: number) => {
    try {
      setIsWithdrawing(applicationId)
      await applicationService.withdrawApplication(applicationId)
      // Remove the application from the list or reload
      await loadApplications()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to withdraw application")
    } finally {
      setIsWithdrawing(null)
    }
  }

  const filterApplications = (status?: Application["status"]) => {
    if (!status) return applications
    return applications.filter((app) => app.status === status)
  }

  const getStatusCount = (status: Application["status"]) => {
    return applications.filter((app) => app.status === status).length
  }

  if (!user || user.role !== 1) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading applications...</span>
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">Start applying to jobs to see your applications here</p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({getStatusCount("Submitted")})</TabsTrigger>
              <TabsTrigger value="review">Review ({getStatusCount("UnderReview")})</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted ({getStatusCount("Shortlisted")})</TabsTrigger>
              <TabsTrigger value="interviewed">Interviewed ({getStatusCount("Interviewed")})</TabsTrigger>
              <TabsTrigger value="final">Final ({getStatusCount("Offered") + getStatusCount("Hired")})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onWithdraw={handleWithdraw}
                  isWithdrawing={isWithdrawing === application.id}
                />
              ))}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {filterApplications("Submitted").map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onWithdraw={handleWithdraw}
                  isWithdrawing={isWithdrawing === application.id}
                />
              ))}
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              {filterApplications("UnderReview").map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onWithdraw={handleWithdraw}
                  isWithdrawing={isWithdrawing === application.id}
                />
              ))}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {filterApplications("Shortlisted").map((application) => (
                <ApplicationCard key={application.id} application={application} showActions={false} />
              ))}
            </TabsContent>

            <TabsContent value="interviewed" className="space-y-4">
              {filterApplications("Interviewed").map((application) => (
                <ApplicationCard key={application.id} application={application} showActions={false} />
              ))}
            </TabsContent>

            <TabsContent value="final" className="space-y-4">
              {[...filterApplications("Offered"), ...filterApplications("Hired")].map((application) => (
                <ApplicationCard key={application.id} application={application} showActions={false} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
