"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookingDialog } from "@/components/tenant/booking-dialog"
import { Heart, MapPin, Bed, Bath, Star } from "lucide-react"
import type { Property, PropertyImage } from "@prisma/client"

interface PropertyWithDetails extends Property {
  images: PropertyImage[]
  landlord: {
    name: string | null
    email: string
  }
  _count: {
    reviews: number
  }
  reviews?: Array<{ rating: number }>
}

interface PropertyCardProps {
  property: PropertyWithDetails
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0]

  const averageRating =
    property.reviews && property.reviews.length > 0
      ? property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length
      : 0

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          <img
            src={primaryImage?.imageUrl || "/placeholder.svg?height=200&width=300&query=apartment"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full p-0 ${isFavorite ? "text-red-500" : "text-white"}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          {property.images.length > 1 && (
            <Badge variant="secondary" className="absolute bottom-2 right-2">
              +{property.images.length - 1} photos
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {property.city}, {property.postalCode}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Bed className="mr-1 h-4 w-4" />
                {property.bedrooms} bed
              </div>
              <div className="flex items-center">
                <Bath className="mr-1 h-4 w-4" />
                {property.bathrooms} bath
              </div>
              {averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                  {averageRating.toFixed(1)} ({property._count.reviews})
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="text-2xl font-bold">${property.rent.toString()}/mo</div>
          <div className="space-x-2">
            <Link href={`/properties/${property.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button size="sm" onClick={() => setIsBookingOpen(true)}>
              Book Now
            </Button>
          </div>
        </CardFooter>
      </Card>

      <BookingDialog property={property} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
