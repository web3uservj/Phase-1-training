import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"
import type { JobSeekerProfile, Company } from "@/lib/profiles"
import type { User } from "@/lib/auth"
import Link from "next/link"

interface ProfileCompletionProps {
  user: User
  jobSeekerProfile?: JobSeekerProfile | null
  companyProfile?: Company | null
}

export function ProfileCompletionIndicator({ user, jobSeekerProfile, companyProfile }: ProfileCompletionProps) {
  const getJobSeekerCompletion = () => {
    if (!jobSeekerProfile) return { percentage: 20, items: [] }

    const items = [
      { label: "Basic Information", completed: true },
      { label: "Professional Summary", completed: !!jobSeekerProfile.summary },
      { label: "Skills", completed: !!jobSeekerProfile.skills },
      { label: "Education", completed: !!jobSeekerProfile.education },
      { label: "Work Experience", completed: !!jobSeekerProfile.experience },
      { label: "Location", completed: !!jobSeekerProfile.location },
      { label: "Resume Upload", completed: !!jobSeekerProfile.resumeFileName },
    ]

    const completedCount = items.filter((item) => item.completed).length
    const percentage = Math.round((completedCount / items.length) * 100)

    return { percentage, items }
  }

  const getCompanyCompletion = () => {
    if (!companyProfile) return { percentage: 20, items: [] }

    const items = [
      { label: "Basic Information", completed: true },
      { label: "Company Name", completed: !!companyProfile.name },
      { label: "Company Description", completed: !!companyProfile.description },
      { label: "Industry", completed: !!companyProfile.industry },
      { label: "Location", completed: !!companyProfile.location },
      { label: "Website", completed: !!companyProfile.website },
      { label: "Company Logo", completed: !!companyProfile.logoFileName },
    ]

    const completedCount = items.filter((item) => item.completed).length
    const percentage = Math.round((completedCount / items.length) * 100)

    return { percentage, items }
  }

  const completion = user.role === 1 ? getJobSeekerCompletion() : getCompanyCompletion()

  if (completion.percentage >= 100) {
    return null // Don't show if profile is complete
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          {user.role === 1
            ? "A complete profile helps employers find you and increases your chances of getting hired"
            : "A complete company profile attracts better candidates"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Profile Completion</span>
            <span>{completion.percentage}%</span>
          </div>
          <Progress value={completion.percentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {completion.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={item.completed ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
            </div>
          ))}
        </div>

        <Button asChild className="w-full">
          <Link href="/profile">Complete Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
