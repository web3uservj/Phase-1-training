"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { jobService, Job } from "@/lib/jobs"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs()
        setJobs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (loading) return <p>Loading jobs...</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="mb-3">
            <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline">
              {job.title} - {job.companyName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
