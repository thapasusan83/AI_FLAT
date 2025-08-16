"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, MapPin, Bed, Bath, Star } from "lucide-react"

interface SimpleProperty {
  id: string
  title: string
  description: string
  rent: number
  bedrooms: number
  bathrooms: number
  city: string
  postalCode: string
  images?: Array<{ imageUrl: string; isPrimary?: boolean }>
  landlord?: { name?: string; email?: string }
  _count?: { reviews?: number }
  reviews?: Array<{ rating: number }>
}

interface PropertyCardProps {
  property: SimpleProperty
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const images = property.images || []
  const primaryImage = images.find((img) => img.isPrimary) || images[0]
  const imageUrl = primaryImage?.imageUrl || `/placeholder.svg?height=200&width=300&query=apartment`

  const reviews = property.reviews || []
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

  const reviewCount = property._count?.reviews || 0

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={property.title || "Property"}
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
          {images.length > 1 && (
            <Badge variant="secondary" className="absolute bottom-2 right-2">
              +{images.length - 1} photos
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title || "Untitled Property"}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {property.city || "Unknown City"}, {property.postalCode || "N/A"}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {property.description || "No description available"}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Bed className="mr-1 h-4 w-4" />
                {property.bedrooms || 0} bed
              </div>
              <div className="flex items-center">
                <Bath className="mr-1 h-4 w-4" />
                {property.bathrooms || 0} bath
              </div>
              {averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                  {averageRating.toFixed(1)} ({reviewCount})
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="text-2xl font-bold">${(property.rent || 0).toString()}/mo</div>
          <div className="space-x-2">
            <Link href={`/properties/${property.id || ""}`}>
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

      {isBookingOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsBookingOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Book {property.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Booking functionality will be available once authentication is set up.
            </p>
            <Button onClick={() => setIsBookingOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
