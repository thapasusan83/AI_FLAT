"use client"

import type React from "react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Simplified provider that doesn't depend on NextAuth until it's properly configured
  return <>{children}</>
}
