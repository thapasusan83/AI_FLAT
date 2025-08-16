"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewDialog } from "./review-dialog"
import { MapPin, Calendar, DollarSign, Star } from "lucide-react"
import type { Booking, Property, PropertyImage } from "@prisma/client"

interface BookingWithProperty extends Booking {
  property: Property & {
    images: PropertyImage[]
    landlord: {
      name: string | null
      email: string
    }
  }
}

interface UserBookingsProps {
  bookings: BookingWithProperty[]
}

export function UserBookings({ bookings }: UserBookingsProps) {
  const [reviewingBooking, setReviewingBooking] = useState<BookingWithProperty | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      case "CANCELLED":
        return "outline"
      default:
        return "secondary"
    }
  }

  const canReview = (booking: BookingWithProperty) => {
    return booking.status === "APPROVED" && new Date(booking.endDate) < new Date()
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Start browsing properties to make your first booking!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{booking.property.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="mr-1 h-4 w-4" />
                    {booking.property.city}, {booking.property.postalCode}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground">Booking period</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">${booking.totalAmount.toString()}</p>
                    <p className="text-muted-foreground">Total amount</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Landlord: {booking.property.landlord.name}</p>
                  <p className="text-muted-foreground">{booking.property.landlord.email}</p>
                </div>
              </div>
              {booking.message && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Your message:</p>
                  <p className="text-sm">{booking.message}</p>
                </div>
              )}
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  View Property
                </Button>
                {canReview(booking) && (
                  <Button size="sm" onClick={() => setReviewingBooking(booking)}>
                    <Star className="mr-1 h-4 w-4" />
                    Write Review
                  </Button>
                )}
                {booking.status === "PENDING" && (
                  <Button variant="destructive" size="sm">
                    Cancel Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviewingBooking && (
        <ReviewDialog
          booking={reviewingBooking}
          isOpen={!!reviewingBooking}
          onClose={() => setReviewingBooking(null)}
        />
      )}
    </>
  )
}
