"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const statusMap: Record<number, string> = {
  1: "Applied",
  2: "UnderReview",
  3: "Shortlisted",
  4: "InterviewScheduled",
  5: "Interviewed",
  6: "Rejected",
  7: "Hired",
}

const reverseStatusMap: Record<string, number> = Object.fromEntries(
  Object.entries(statusMap).map(([k, v]) => [v, Number(k)])
)

interface Application {
  id: number
  jobId: number
  jobTitle: string
  companyName: string
  applicantId: number
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  status: number
  appliedDate: string
  reviewedDate?: string
  reviewNotes?: string
  interviewDate?: string
  interviewNotes?: string
}

export default function ReviewApplicationPage() {
  const params = useParams()
  const applicationId = params?.id as string
  const token = localStorage.getItem("token") // JWT token
  const [application, setApplication] = useState<Application | null>(null)
  const [status, setStatus] = useState("Applied")
  const [reviewNotes, setReviewNotes] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewNotes, setInterviewNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchApplication() {
      if (!token) return alert("No token found. Please login first.")
      try {
        const res = await fetch(`${API_URL}/Applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to load application")
        const data: Application = await res.json()
        setApplication(data)
        setStatus(statusMap[data.status] || "Applied")
        setReviewNotes(data.reviewNotes || "")
        setInterviewDate(data.interviewDate ? data.interviewDate.substring(0, 16) : "")
        setInterviewNotes(data.interviewNotes || "")
      } catch (err) {
        console.error(err)
        alert("Error fetching application")
      } finally {
        setLoading(false)
      }
    }
    if (applicationId) fetchApplication()
  }, [applicationId, token])

  async function handleSave() {
    if (!token) return alert("No token found. Please login first.")
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/Applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: reverseStatusMap[status],
          reviewNotes,
          interviewDate: interviewDate || null,
          interviewNotes,
        }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      const updated: Application = await res.json()
      setApplication(updated)
      setStatus(statusMap[updated.status] || "Applied")
      alert("Application status updated successfully")
    } catch (err) {
      console.error(err)
      alert("Error updating application")
    } finally {
      setSaving(false)
    }
  }

  // ✅ Fetch resume with token and allow view/download
  async function handleViewResume(userId: number) {
    if (!token) return alert("No token found. Please login first.")

    try {
      const res = await fetch(`${API_URL}/JobSeekerProfile/${userId}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch resume")

      const blob = await res.blob()
      const disposition = res.headers.get("Content-Disposition")
      let fileName = "resume"
      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "")
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName // download file
      a.target = "_blank" // open in new tab
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Error fetching resume")
    }
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (!application) return <p className="p-4">Application not found</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Job:</strong> {application.jobTitle} @ {application.companyName}</p>
            <p><strong>Applicant:</strong> {application.applicantName} ({application.applicantEmail})</p>
            <p><strong>Applied on:</strong> {format(new Date(application.appliedDate), "PPP")}</p>
          </div>

          <div>
            <Label>Cover Letter</Label>
            <p className="p-2 border rounded bg-gray-50">{application.coverLetter || "No cover letter provided."}</p>
          </div>

          {/* Resume Button */}
          {application.applicantId && (
            <div className="mt-2">
              <Label>Resume</Label>
              <Button
                variant="outline"
                onClick={() => handleViewResume(application.applicantId)}
              >
                View / Download Resume
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review & Update Status */}
      <Card>
        <CardHeader>
          <CardTitle>Review & Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(statusMap).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/([A-Z])/g, " $1").trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Review Notes</Label>
            <Textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} />
          </div>

          {status === "InterviewScheduled" && (
            <>
              <div>
                <Label>Interview Date</Label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Interview Notes</Label>
                <Textarea value={interviewNotes} onChange={(e) => setInterviewNotes(e.target.value)} />
              </div>
            </>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
