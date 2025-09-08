"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { applicationService, type Application, type UpdateApplicationStatusData } from "@/lib/applications"

interface ApplicationStatusUpdateProps {
  application: Application
  onUpdate: (updatedApplication: Application) => void
  onCancel: () => void
}

export function ApplicationStatusUpdate({ application, onUpdate, onCancel }: ApplicationStatusUpdateProps) {
  const [status, setStatus] = useState<Application["status"]>(application.status)
  const [reviewNotes, setReviewNotes] = useState(application.reviewNotes || "")
  const [interviewDate, setInterviewDate] = useState(
    application.interviewDate ? new Date(application.interviewDate).toISOString().slice(0, 16) : "",
  )
  const [interviewNotes, setInterviewNotes] = useState(application.interviewNotes || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError("")

    try {
      const updateData: UpdateApplicationStatusData = {
        status,
        reviewNotes: reviewNotes.trim() || undefined,
        interviewDate: interviewDate || undefined,
        interviewNotes: interviewNotes.trim() || undefined,
      }

      const updatedApplication = await applicationService.updateApplicationStatus(application.id, updateData)
      onUpdate(updatedApplication)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update application status")
    } finally {
      setIsUpdating(false)
    }
  }

  const statusOptions = [
    { value: "Submitted", label: "Submitted" },
    { value: "UnderReview", label: "Under Review" },
    { value: "Shortlisted", label: "Shortlisted" },
    { value: "Interviewed", label: "Interviewed" },
    { value: "Offered", label: "Offered" },
    { value: "Hired", label: "Hired" },
    { value: "Rejected", label: "Rejected" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Application Status</CardTitle>
        <CardDescription>
          Update the status for {application.applicantName}'s application to {application.jobTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Application Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Application["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewNotes">Review Notes</Label>
            <Textarea
              id="reviewNotes"
              placeholder="Add notes about this application..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
            />
          </div>

          {(status === "Shortlisted" || status === "Interviewed") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date & Time</Label>
                <Input
                  id="interviewDate"
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewNotes">Interview Notes</Label>
                <Textarea
                  id="interviewNotes"
                  placeholder="Interview details, location, or additional notes..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
