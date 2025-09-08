"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

import { companyService, type CreateCompanyData } from "@/lib/company"

export default function AddCompanyPage() {
  const router = useRouter()
  const [form, setForm] = useState<CreateCompanyData>({
    name: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    employeeCount: undefined,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: keyof CreateCompanyData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await companyService.createCompany(form)
      router.push("/employer") // Redirect to dashboard after success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create company")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add Your Company</CardTitle>
            <CardDescription>Provide company details to start posting jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description || ""}
                  onChange={e => handleChange("description", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry || ""}
                  onChange={e => handleChange("industry", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location || ""}
                  onChange={e => handleChange("location", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website || ""}
                  onChange={e => handleChange("website", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  type="number"
                  id="employeeCount"
                  value={form.employeeCount || ""}
                  onChange={e => handleChange("employeeCount", Number(e.target.value))}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Company
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
