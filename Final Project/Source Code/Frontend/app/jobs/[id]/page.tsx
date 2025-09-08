"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { jobService, Job } from "@/lib/jobs"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.id)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(jobId)
        setJob(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  if (loading) return <Loader2 className="animate-spin" />

  if (!job) return <p>Job not found</p>

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="mb-2">{job.description}</p>
      <p className="mb-2">Company: {job.companyName}</p>
      <p className="mb-2">Location: {job.companyLocation}</p>
      <Button onClick={() => router.push(`/jobs/${job.id}/apply`)}>Apply Now</Button>
    </div>
  )
}
