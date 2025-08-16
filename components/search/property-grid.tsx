"use client"

import { PropertyCard } from "./property-card"
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
}

interface PropertyGridProps {
  properties: PropertyWithDetails[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
        <p className="text-muted-foreground">Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
