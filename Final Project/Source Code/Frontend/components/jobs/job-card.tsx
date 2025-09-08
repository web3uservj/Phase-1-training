import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, DollarSign } from "lucide-react"
import type { Job } from "@/lib/jobs"

interface JobCardProps {
  job: Job
  showApplyButton?: boolean
}

export function JobCard({ job, showApplyButton = true }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case "FullTime":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "PartTime":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Contract":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "Temporary":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      case "Mid":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Senior":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Executive":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg">
              <Link href={`/jobs/${job.id}`} className="hover:text-accent transition-colors">
                {job.title}
              </Link>
            </CardTitle>
            <CardDescription className="font-medium text-foreground">{job.companyName}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getJobTypeColor(job.jobType)}>
              {job.jobType === "FullTime" ? "Full Time" : job.jobType === "PartTime" ? "Part Time" : job.jobType}
            </Badge>
            <Badge className={getExperienceLevelColor(job.experienceLevel)}>{job.experienceLevel}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(job.postedDate)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{job.applicationCount} applicants</span>
          </div>

          {formatSalary(job.minSalary, job.maxSalary) && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
            </div>
          )}
        </div>

        {job.category && (
          <div>
            <Badge variant="outline">{job.category}</Badge>
          </div>
        )}

        {showApplyButton && (
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${job.id}`}>View Details</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
