"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import type { JobSearchFilters } from "@/lib/jobs"

interface JobSearchProps {
  onSearch: (filters: JobSearchFilters) => void
  isLoading?: boolean
}

export function JobSearch({ onSearch, isLoading = false }: JobSearchProps) {
  const [filters, setFilters] = useState<JobSearchFilters>({
    title: "",
    location: "",
    category: "",
    jobType: "Any type",
    experienceLevel: "Any level",
    minSalary: undefined,
    maxSalary: undefined,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters: JobSearchFilters = {
      title: "",
      location: "",
      category: "",
      jobType: "Any type",
      experienceLevel: "Any level",
      minSalary: undefined,
      maxSalary: undefined,
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const updateFilter = (key: keyof JobSearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title or Keywords</Label>
              <Input
                id="title"
                placeholder="e.g. Software Engineer, Marketing"
                value={filters.title}
                onChange={(e) => updateFilter("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, Remote"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
            </Button>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={filters.jobType || "Any type"}
                    onValueChange={(value) => updateFilter("jobType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any type">Any type</SelectItem>
                      <SelectItem value="FullTime">Full Time</SelectItem>
                      <SelectItem value="PartTime">Part Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select
                    value={filters.experienceLevel || "Any level"}
                    onValueChange={(value) => updateFilter("experienceLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any level">Any level</SelectItem>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior Level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Technology, Healthcare"
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Minimum Salary</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    placeholder="e.g. 50000"
                    value={filters.minSalary || ""}
                    onChange={(e) => updateFilter("minSalary", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Maximum Salary</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    placeholder="e.g. 100000"
                    value={filters.maxSalary || ""}
                    onChange={(e) => updateFilter("maxSalary", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search Jobs"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
