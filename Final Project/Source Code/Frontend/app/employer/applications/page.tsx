"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"
import { applicationService, Application } from "@/lib/applications"

export default function EmployerApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null) // hold user from localStorage

  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    setUser(storedUser)

    if (!storedUser) {
      router.push("/login")
      return
    }
    if (storedUser.role !== 2) {
      router.push("/") // only employers
      return
    }

    loadApplications()
  }, [router])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationService.getAllApplicationsForEmployer()
      setApplications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 2) return null
  if (loading) return <Loader2 className="animate-spin h-8 w-8 mx-auto mt-20" />

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Applications</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.jobTitle}</CardTitle>
                  <CardDescription>
                    {app.applicantName} ({app.applicantEmail}) applied on{" "}
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Status: {app.status}</p>
                  {app.coverLetter && (
                    <div className="mt-2">
                      <p className="font-medium">Cover Letter:</p>
                      <p className="text-sm">{app.coverLetter}</p>
                    </div>
                  )}
                  <Button
                    className="mt-2"
                    onClick={() => router.push(`/employer/applications/${app.id}`)}
                  >
                    Review Application
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
