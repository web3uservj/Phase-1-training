"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { jobService, CreateJobPayload } from "@/lib/jobs"

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    jobType: "",
    experienceLevel: "",
    category: "",
    applicationDeadline: "",
    isActive: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse salary range
      let minSalary: number | undefined
      let maxSalary: number | undefined
      if (formData.salaryRange) {
        const match = formData.salaryRange.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/)
        if (match) {
          minSalary = parseInt(match[1].replace(/,/g, ""))
          maxSalary = parseInt(match[2].replace(/,/g, ""))
        } else {
          minSalary = maxSalary = parseInt(formData.salaryRange.replace(/,/g, ""))
        }
      }

      // Map frontend values to backend numeric enums
      const jobTypeMapping: Record<string, number> = {
        "Full-time": 1,
        "Part-time": 2,
        Contract: 3,
        Internship: 4,
        Remote: 5,
      }

      const experienceLevelMapping: Record<string, number> = {
        Entry: 1,
        Mid: 2,
        Senior: 3,
        Executive: 4,
      }

      const jobPayload: CreateJobPayload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location || "",
        minSalary: minSalary || 0,
        maxSalary: maxSalary || 0,
        jobType: jobTypeMapping[formData.jobType]!,
        experienceLevel: experienceLevelMapping[formData.experienceLevel]!,
        category: formData.category || "General",
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline).toISOString()
          : undefined,
        isActive: formData.isActive,
      }

      console.log("JOB PAYLOAD:", jobPayload)
      await jobService.createJob(jobPayload)
      router.push("/employer/jobs")
    } catch (err) {
      console.error("Failed to create job:", err)
      alert("Failed to create job. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/employer/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Post New Job</CardTitle>
          <CardDescription>Fill in the job details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Job Title *</Label>
              <Input required value={formData.title} onChange={e => handleChange("title", e.target.value)} />
            </div>

            <div>
              <Label>Location *</Label>
              <Input required value={formData.location} onChange={e => handleChange("location", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Type *</Label>
                <Select value={formData.jobType} onValueChange={v => handleChange("jobType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Experience Level *</Label>
                <Select value={formData.experienceLevel} onValueChange={v => handleChange("experienceLevel", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Salary Range</Label>
              <Input
                placeholder="$80,000 - $120,000"
                value={formData.salaryRange}
                onChange={e => handleChange("salaryRange", e.target.value)}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => handleChange("category", e.target.value)} />
            </div>

            <div>
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={e => handleChange("applicationDeadline", e.target.value)}
              />
            </div>

            <div>
              <Label>Job Description *</Label>
              <Textarea required value={formData.description} onChange={e => handleChange("description", e.target.value)} />
            </div>

            <div>
              <Label>Requirements *</Label>
              <Textarea required value={formData.requirements} onChange={e => handleChange("requirements", e.target.value)} />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/employer/jobs">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Post Job"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
