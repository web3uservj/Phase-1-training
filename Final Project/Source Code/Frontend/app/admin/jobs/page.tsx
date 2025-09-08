"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, CheckCircle, Clock, XCircle, Loader2, ArrowLeft } from "lucide-react"
import { authService, type User } from "@/lib/auth"
import { adminService, type JobModeration } from "@/lib/admin"
import Link from "next/link"

export default function AdminJobsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<JobModeration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const loadUserAndJobs = async () => {
      try {
        setIsLoading(true)
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

        // Fetch jobs after user is confirmed
        const jobsData = await adminService.getJobsForModeration()
        setJobs(jobsData)
      } catch (err: any) {
        setError(err?.message || "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndJobs()
  }, [router])

  const stats = {
    total: jobs.length,
    needsReview: jobs.filter(j => j.requiresReview).length,
    active: jobs.filter(j => j.isActive).length,
    inactive: jobs.filter(j => !j.isActive).length,
  }

  const handleApproveJob = async (jobId: number) => {
    try {
      await adminService.approveJob(jobId)
      setJobs(jobs => jobs.filter(job => job.id !== jobId))
    } catch (err: any) {
      setError(err?.message || "Failed to approve job")
    }
  }

  const handleRejectJob = async () => {
    if (!selectedJobId || !rejectReason.trim()) {
      setError("Please provide a reason for rejection")
      return
    }
    try {
      await adminService.rejectJob(selectedJobId, rejectReason)
      setJobs(jobs => jobs.filter(job => job.id !== selectedJobId))
      setIsRejectDialogOpen(false)
      setRejectReason("")
      setSelectedJobId(null)
    } catch (err: any) {
      setError(err?.message || "Failed to reject job")
    }
  }

  const openRejectDialog = (jobId: number) => {
    setSelectedJobId(jobId)
    setRejectReason("")
    setIsRejectDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
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
          <h1 className="text-3xl font-bold mb-2">Job Moderation</h1>
          <p className="text-muted-foreground">Review and moderate job postings</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Jobs" value={stats.total} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Needs Review" value={stats.needsReview} valueColor="text-yellow-600" icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Active" value={stats.active} valueColor="text-green-600" icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Inactive" value={stats.inactive} valueColor="text-red-600" icon={<XCircle className="h-4 w-4 text-muted-foreground" />} />
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No jobs to moderate</h3>
                <p className="text-muted-foreground">All jobs have been reviewed</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        {job.requiresReview && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Needs Review
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.companyName} {job.location && `• ${job.location}`}</p>
                      <p className="text-sm mb-2">{job.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        <span>Applications: {job.applicationCount}</span>
                        <span>Reports: {job.reportCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/jobs/${job.id}`)}>
                        View Details
                      </Button>
                      {job.requiresReview && (
                        <>
                          <Button size="sm" onClick={() => handleApproveJob(job.id)}>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => openRejectDialog(job.id)}>
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Job Posting</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for rejection</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide reason..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRejectJob} disabled={!rejectReason.trim()}>Reject Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function StatCard({ title, value, valueColor = "text-foreground", icon }: { title: string; value: number; valueColor?: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      </CardContent>
    </Card>
  )
}
