"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, FileText, Send } from "lucide-react"
import { applicationService, type CreateApplicationData } from "@/lib/applications"
import type { Job } from "@/lib/jobs"

interface ApplicationFormProps {
  job: Job
}

export function ApplicationForm({ job }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const applicationData: CreateApplicationData = {
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
      }

      await applicationService.createApplication(applicationData)
      setSuccess(true)

      // Redirect to applications page after a short delay
      setTimeout(() => {
        router.push("/dashboard/applications")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Your application for <strong>{job.title}</strong> at <strong>{job.companyName}</strong> has been
              successfully submitted.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to your applications page shortly, or you can navigate there manually.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Job Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Apply for Position
          </CardTitle>
          <CardDescription>Review the job details and submit your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-muted-foreground">{job.companyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Location:</span>
                <span className="ml-2">{job.location || "Not specified"}</span>
              </div>
              <div>
                <span className="font-medium">Job Type:</span>
                <span className="ml-2">
                  {job.jobType === "FullTime" ? "Full Time" : job.jobType === "PartTime" ? "Part Time" : job.jobType}
                </span>
              </div>
              <div>
                <span className="font-medium">Experience:</span>
                <span className="ml-2">{job.experienceLevel}</span>
              </div>
              <div>
                <span className="font-medium">Applications:</span>
                <span className="ml-2">{job.applicationCount} candidates</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Application</CardTitle>
          <CardDescription>Tell the employer why you're the perfect fit for this role</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write a compelling cover letter explaining why you're interested in this position and what makes you a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                disabled={isSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                A well-written cover letter can significantly improve your chances of getting noticed.
              </p>
            </div>

            <Separator />

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Before you apply:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Make sure your profile is complete and up-to-date</li>
                <li>• Review the job requirements carefully</li>
                <li>• Customize your cover letter for this specific role</li>
                <li>• Double-check your contact information</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
