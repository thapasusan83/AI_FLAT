"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function PropertySearch() {
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      router.push(`/search?city=${encodeURIComponent(location.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Enter city or location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="rounded-r-none"
      />
      <Button type="submit" className="rounded-l-none">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
