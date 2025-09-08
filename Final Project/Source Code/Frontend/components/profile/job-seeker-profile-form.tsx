"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText, X } from "lucide-react"
import {
  profileService,
  type JobSeekerProfile,
  type CreateJobSeekerProfileData,
  type UpdateJobSeekerProfileData,
} from "@/lib/profiles"

interface JobSeekerProfileFormProps {
  profile?: JobSeekerProfile | null
  onSave: (profile: JobSeekerProfile) => void
}

export function JobSeekerProfileForm({ profile, onSave }: JobSeekerProfileFormProps) {
  const [formData, setFormData] = useState<CreateJobSeekerProfileData>({
    summary: "",
    skills: "",
    education: "",
    experience: "",
    location: "",
    expectedSalary: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (profile) {
      setFormData({
        summary: profile.summary || "",
        skills: profile.skills || "",
        education: profile.education || "",
        experience: profile.experience || "",
        location: profile.location || "",
        expectedSalary: profile.expectedSalary || undefined,
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      let savedProfile: JobSeekerProfile

      if (profile) {
        savedProfile = await profileService.updateJobSeekerProfile(formData as UpdateJobSeekerProfileData)
        setSuccess("Profile updated successfully!")
      } else {
        savedProfile = await profileService.createJobSeekerProfile(formData)
        setSuccess("Profile created successfully!")
      }

      onSave(savedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedSalary" ? (value ? Number(value) : undefined) : value,
    }))
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [".pdf", ".doc", ".docx"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
    if (!allowedTypes.includes(fileExtension)) {
      setError("Please upload a PDF, DOC, or DOCX file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const updatedProfile = await profileService.uploadResume(file)
      onSave(updatedProfile)
      setSuccess("Resume uploaded successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume")
    } finally {
      setIsUploading(false)
    }
  }

  const handleResumeDelete = async () => {
    setIsUploading(true)
    setError("")

    try {
      await profileService.deleteResume()
      // Refresh profile data
      if (profile) {
        const updatedProfile = { ...profile, resumeFileName: undefined, resumeFilePath: undefined }
        onSave(updatedProfile)
      }
      setSuccess("Resume deleted successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Seeker Profile</CardTitle>
          <CardDescription>Complete your profile to attract potential employers</CardDescription>
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
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="Write a brief summary of your professional background and career goals..."
                value={formData.summary}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g. JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Separate skills with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. New York, NY or Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                name="education"
                placeholder="List your educational background, degrees, certifications..."
                value={formData.education}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="Describe your work experience, previous roles, achievements..."
                value={formData.experience}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary (Annual)</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                type="number"
                placeholder="e.g. 75000"
                value={formData.expectedSalary || ""}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Optional - helps employers match you with suitable positions
              </p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {profile ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{profile ? "Update Profile" : "Create Profile"}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resume Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>
            Upload your resume to make it easier for employers to evaluate your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.resumeFileName ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{profile.resumeFileName}</p>
                  <p className="text-sm text-muted-foreground">Resume uploaded</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleResumeDelete} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Upload your resume (PDF, DOC, DOCX - Max 5MB)</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
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
                      Choose File
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
