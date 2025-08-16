"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PropertyForm } from "./property-form"
import { Edit, Trash2, Eye, Calendar, MapPin } from "lucide-react"
import type { Property, PropertyImage, Booking } from "@prisma/client"

interface PropertyWithDetails extends Property {
  images: PropertyImage[]
  bookings: Booking[]
  _count: {
    bookings: number
    reviews: number
  }
}

interface PropertyListProps {
  properties: PropertyWithDetails[]
}

export function PropertyList({ properties }: PropertyListProps) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting property:", error)
    }
  }

  const toggleAvailability = async (propertyId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No properties listed yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Add your first property to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0].imageUrl || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={property.isAvailable ? "default" : "secondary"}>
                  {property.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1">{property.title}</CardTitle>
              <CardDescription className="line-clamp-2">{property.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {property.city}, {property.postalCode}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">${property.rent.toString()}/month</div>
                <div className="text-sm text-muted-foreground">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {property.bookings.length} pending
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {property._count.reviews} reviews
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingProperty(property)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAvailability(property.id, property.isAvailable)}
                >
                  {property.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </Button>

                <Button variant="destructive" size="sm" onClick={() => handleDelete(property.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {editingProperty && (
            <PropertyForm
              property={editingProperty}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setEditingProperty(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
