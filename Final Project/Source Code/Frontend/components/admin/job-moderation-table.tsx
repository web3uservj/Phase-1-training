"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"
import { adminService, type JobModeration } from "@/lib/admin"
import Link from "next/link"

interface JobModerationTableProps {
  jobs: JobModeration[]
  onJobUpdate: (jobId: number) => void
}

export function JobModerationTable({ jobs, onJobUpdate }: JobModerationTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<JobModeration | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState<number | null>(null)
  const [error, setError] = useState("")

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.postedByName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApproveJob = async (jobId: number) => {
    setIsProcessing(jobId)
    setError("")

    try {
      await adminService.approveJob(jobId)
      onJobUpdate(jobId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve job")
    } finally {
      setIsProcessing(null)
    }
  }

  const handleRejectJob = async (jobId: number, reason: string) => {
    setIsProcessing(jobId)
    setError("")

    try {
      await adminService.rejectJob(jobId, reason)
      onJobUpdate(jobId)
      setSelectedJob(null)
      setRejectionReason("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject job")
    } finally {
      setIsProcessing(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs by title, company, or poster..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Jobs Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{job.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{job.companyName}</div>
                </TableCell>
                <TableCell>{job.postedByName}</TableCell>
                <TableCell>{formatDate(job.postedDate)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {job.requiresReview && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Needs Review
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{job.applicationCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {/* View Job */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Approve Job */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveJob(job.id)}
                      disabled={isProcessing === job.id || !job.requiresReview}
                      className="text-green-600 hover:text-green-700"
                    >
                      {isProcessing === job.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Reject Job */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                          disabled={isProcessing === job.id || !job.requiresReview}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Job Posting</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to reject "{job.title}" by {job.companyName}? Please provide a reason
                            for rejection.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reason">Rejection Reason *</Label>
                            <Textarea
                              id="reason"
                              placeholder="Please explain why this job posting is being rejected..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedJob(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => selectedJob && handleRejectJob(selectedJob.id, rejectionReason)}
                            disabled={isProcessing === selectedJob?.id || !rejectionReason.trim()}
                          >
                            {isProcessing === selectedJob?.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              "Reject Job"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No jobs found matching your search." : "No jobs found for moderation."}
        </div>
      )}
    </div>
  )
}
