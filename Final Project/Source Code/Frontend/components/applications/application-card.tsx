"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building, Eye } from "lucide-react"
import type { Application } from "@/lib/applications"

interface ApplicationCardProps {
  application: Application
  showActions?: boolean
  onWithdraw?: (id: number) => void
  isWithdrawing?: boolean
}

export function ApplicationCard({ application, showActions = true, onWithdraw, isWithdrawing }: ApplicationCardProps) {
  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800"
      case "UnderReview":
        return "bg-yellow-100 text-yellow-800"
      case "Shortlisted":
        return "bg-purple-100 text-purple-800"
      case "Interviewed":
        return "bg-indigo-100 text-indigo-800"
      case "Offered":
        return "bg-green-100 text-green-800"
      case "Hired":
        return "bg-emerald-100 text-emerald-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Application["status"]) => {
    switch (status) {
      case "UnderReview":
        return "Under Review"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const canWithdraw = application.status === "Submitted" || application.status === "UnderReview"

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              <Link href={`/jobs/${application.jobId}`} className="hover:text-accent transition-colors">
                {application.jobTitle}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {application.companyName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>
          {application.reviewedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Reviewed {formatDate(application.reviewedDate)}</span>
            </div>
          )}
        </div>

        {application.coverLetter && (
          <div>
            <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{application.coverLetter}</p>
          </div>
        )}

        {application.reviewNotes && (
          <div>
            <h4 className="text-sm font-medium mb-2">Review Notes</h4>
            <p className="text-sm text-muted-foreground">{application.reviewNotes}</p>
          </div>
        )}

        {application.interviewDate && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-1">Interview Scheduled</h4>
            <p className="text-sm text-muted-foreground">
              {new Date(application.interviewDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {application.interviewNotes && (
              <p className="text-sm text-muted-foreground mt-2">{application.interviewNotes}</p>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${application.jobId}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Job
              </Link>
            </Button>
            {canWithdraw && onWithdraw && (
              <Button variant="outline" size="sm" onClick={() => onWithdraw(application.id)} disabled={isWithdrawing}>
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
