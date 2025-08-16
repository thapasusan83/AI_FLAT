"use client"

import { useState } from "react"
import { BookingDialog } from "@/components/tenant/booking-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"
import type { Property } from "@prisma/client"
import type { User as UserType } from "next-auth"

interface BookingSectionProps {
  property: Property & {
    landlord: {
      name: string | null
      email: string
    }
  }
  user: UserType | null
}

export function BookingSection({ property, user }: BookingSectionProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>${property.rent.toString()}/month</span>
            <Badge variant={property.isAvailable ? "default" : "secondary"}>
              {property.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              Available from {new Date(property.availableFrom).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              {property.city}, {property.postalCode}
            </div>
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              {property.landlord.name || "Property Owner"}
            </div>
          </div>

          {property.isAvailable ? (
            <Button className="w-full" onClick={() => setIsBookingOpen(true)} disabled={!user}>
              {user ? "Book Now" : "Sign In to Book"}
            </Button>
          ) : (
            <Button className="w-full" disabled>
              Currently Unavailable
            </Button>
          )}

          <div className="text-xs text-muted-foreground text-center">
            You won't be charged until your booking is confirmed
          </div>
        </CardContent>
      </Card>

      {user && <BookingDialog property={property} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />}
    </>
  )
}
