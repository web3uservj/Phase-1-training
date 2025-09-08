"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { jobService, Job } from "@/lib/jobs"
import { applicationService } from "@/lib/applications"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JobApplyPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobData = await jobService.getJobById(jobId)
        setJob(jobData)
        const applied = await applicationService.hasApplied(jobId)
        setHasApplied(applied)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (jobId) loadData()
  }, [jobId])

  const handleApply = async () => {
    if (!job) return
    setSubmitting(true)
    try {
      await applicationService.createApplication({ jobId: job.id, coverLetter })
      alert("Applied successfully!")
      setHasApplied(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to apply")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader2 className="animate-spin" />

  if (!job) return <p>Job not found</p>

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job
      </Button>

      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="mb-2">{job.description}</p>

      {hasApplied ? (
        <Button disabled>Already Applied</Button>
      ) : (
        <>
          <textarea
            className="w-full border p-2 mb-2 rounded"
            placeholder="Cover Letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <Button onClick={handleApply} disabled={submitting}>
            {submitting ? "Applying..." : "Apply Now"}
          </Button>
        </>
      )}
    </div>
  )
}
