import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bed, Bath, Calendar, Star, User } from "lucide-react"
import type { Property } from "@prisma/client"

interface PropertyDetailsProps {
  property: Property & {
    landlord: {
      name: string | null
      email: string
    }
  }
  averageRating: number
}

export function PropertyDetails({ property, averageRating }: PropertyDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="mr-2 h-4 w-4" />
              {property.address}, {property.city}, {property.postalCode}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${property.rent.toString()}</div>
            <div className="text-muted-foreground">per month</div>
          </div>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center">
            <Bed className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{property.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{property.bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
          </div>
          <Badge variant={property.isAvailable ? "default" : "secondary"}>
            {property.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Landlord Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <User className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{property.landlord.name || "Property Owner"}</p>
              <p className="text-sm text-muted-foreground">{property.landlord.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
