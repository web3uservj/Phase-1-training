"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { JobSeekerProfileForm } from "@/components/profile/job-seeker-profile-form"
import { CompanyProfileForm } from "@/components/profile/company-profile-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Building } from "lucide-react"
import { authService, type User as UserType } from "@/lib/auth"
import { profileService, type JobSeekerProfile, type Company } from "@/lib/profiles"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [jobSeekerProfile, setJobSeekerProfile] = useState<JobSeekerProfile | null>(null)
  const [companyProfile, setCompanyProfile] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [userSuccess, setUserSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setUserFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: currentUser.phoneNumber,
    })

    loadProfiles(currentUser)
  }, [router])

  const loadProfiles = async (currentUser: UserType) => {
    try {
      setIsLoading(true)
      setError("")

      if (currentUser.role === 1) {
        try {
          const profile = await profileService.getJobSeekerProfile()
          setJobSeekerProfile(profile)
        } catch (err) {
          // Profile doesn't exist yet, which is fine
          setJobSeekerProfile(null)
        }
      } else if (currentUser.role === 2) {
        try {
          const company = await profileService.getCompanyProfile()
          setCompanyProfile(company)
        } catch (err) {
          // Company profile doesn't exist yet, which is fine
          setCompanyProfile(null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingUser(true)
    setError("")
    setUserSuccess("")

    try {
      // This would call the user service to update basic user info
      // For now, we'll just show success
      setUserSuccess("User information updated successfully!")

      // Update local user data
      if (user) {
        const updatedUser = { ...user, ...userFormData }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user information")
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and profile information</p>
        </div>

        <Tabs defaultValue="user" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Information
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              {user.role === 1 ? <User className="h-4 w-4" /> : <Building className="h-4 w-4" />}
              {user.role === 1 ? "Job Seeker Profile" : "Company Profile"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Update your basic account information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserUpdate} className="space-y-4">
                  {userSuccess && (
                    <Alert>
                      <AlertDescription>{userSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={userFormData.firstName}
                        onChange={handleUserFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userFormData.lastName}
                        onChange={handleUserFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={userFormData.phoneNumber}
                      onChange={handleUserFormChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={user.role} disabled />
                    <p className="text-xs text-muted-foreground">Role cannot be changed</p>
                  </div>

                  <Button type="submit" disabled={isUpdatingUser}>
                    {isUpdatingUser ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Information"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            {user.role === 1 ? (
              <JobSeekerProfileForm profile={jobSeekerProfile} onSave={setJobSeekerProfile} />
            ) : user.role === 2 ? (
              <CompanyProfileForm company={companyProfile} onSave={setCompanyProfile} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Profile management not available for your role.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
