"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, UserX, Loader2, ArrowLeft } from "lucide-react"
import { authService } from "@/lib/auth"
import { adminService, type UserManagement } from "@/lib/admin"
import Link from "next/link"

export default function AdminUsersPage() {
  const [user, setUser] = useState<UserManagement | null>(null)
  const [users, setUsers] = useState<UserManagement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  // Load user only once safely on client-side to avoid infinite loops
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== 3) { // Assuming role is string literal "Admin"
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  // Load all users only after the user state is set
  useEffect(() => {
    if (!user) return

    const loadUsers = async () => {
      try {
        setIsLoading(true)
        setError("")
        const data = await adminService.getAllUsers()
        setUsers(data)
      } catch (err: any) {
        setError(err.message || "Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [user])

  // Update a single user's data in state
  const handleUserUpdate = (updatedUser: UserManagement) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }

  // Remove a user from state on deletion
  const handleUserDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  // Filter users based on role and status
  const getFilteredUsers = (role?: string, status?: string) => {
    return users.filter((u) => {
      if (role && u.role !== role) return false
      if (status === "active" && !u.isActive) return false
      if (status === "inactive" && u.isActive) return false
      return true
    })
  }

  // Calculate user statistics summary
  const getUserStats = () => {
    const total = users.length
    const active = users.filter((u) => u.isActive).length
    const inactive = users.filter((u) => !u.isActive).length
    const jobSeekers = users.filter((u) => u.role === "JobSeeker").length
    const employers = users.filter((u) => u.role === "Employer").length
    const admins = users.filter((u) => u.role === "Admin").length

    return { total, active, inactive, jobSeekers, employers, admins }
  }

  if (!user) return null // Wait for user to load

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  const stats = getUserStats()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.jobSeekers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.employers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.admins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for filtering users */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All Users ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="jobseekers">
              Job Seekers ({stats.jobSeekers})
            </TabsTrigger>
            <TabsTrigger value="employers">
              Employers ({stats.employers})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({stats.inactive})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={getFilteredUsers()}
                  onUserUpdate={handleUserUpdate}
                  onUserDelete={handleUserDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobseekers">
            <Card>
              <CardHeader>
                <CardTitle>Job Seekers</CardTitle>
                <CardDescription>Users looking for employment opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={getFilteredUsers("JobSeeker")}
                  onUserUpdate={handleUserUpdate}
                  onUserDelete={handleUserDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employers">
            <Card>
              <CardHeader>
                <CardTitle>Employers</CardTitle>
                <CardDescription>Companies and recruiters posting job opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={getFilteredUsers("Employer")}
                  onUserUpdate={handleUserUpdate}
                  onUserDelete={handleUserDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Users with active accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={getFilteredUsers(undefined, "active")}
                  onUserUpdate={handleUserUpdate}
                  onUserDelete={handleUserDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Users</CardTitle>
                <CardDescription>Users with deactivated accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={getFilteredUsers(undefined, "inactive")}
                  onUserUpdate={handleUserUpdate}
                  onUserDelete={handleUserDelete}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
