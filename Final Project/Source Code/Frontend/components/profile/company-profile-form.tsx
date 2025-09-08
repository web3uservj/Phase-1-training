"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Building, X } from "lucide-react"
import { profileService, type Company, type CreateCompanyData, type UpdateCompanyData } from "@/lib/profiles"

interface CompanyProfileFormProps {
  company?: Company | null
  onSave: (company: Company) => void
}

export function CompanyProfileForm({ company, onSave }: CompanyProfileFormProps) {
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    employeeCount: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        industry: company.industry || "",
        location: company.location || "",
        website: company.website || "",
        employeeCount: company.employeeCount || undefined,
      })
    }
  }, [company])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      let savedCompany: Company

      if (company) {
        savedCompany = await profileService.updateCompanyProfile(formData as UpdateCompanyData)
        setSuccess("Company profile updated successfully!")
      } else {
        savedCompany = await profileService.createCompanyProfile(formData)
        setSuccess("Company profile created successfully!")
      }

      onSave(savedCompany)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save company profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "employeeCount" ? (value ? Number(value) : undefined) : value,
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or GIF image")
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const updatedCompany = await profileService.uploadCompanyLogo(file)
      onSave(updatedCompany)
      setSuccess("Logo uploaded successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Complete your company profile to attract top talent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your company, mission, and values..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  placeholder="e.g. Technology, Healthcare, Finance"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Number of Employees</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.employeeCount || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {company ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{company ? "Update Company Profile" : "Create Company Profile"}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>Upload your company logo to make your job postings more recognizable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {company?.logoFileName ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  {company.logoFilePath ? (
                    <img
                      src={company.logoFilePath || "/placeholder.svg"}
                      alt={company.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{company.logoFileName}</p>
                  <p className="text-sm text-muted-foreground">Company logo</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Upload company logo (JPEG, PNG, GIF - Max 2MB)</p>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
