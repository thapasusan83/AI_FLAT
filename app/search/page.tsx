import { Suspense } from "react"
import { SearchFilters } from "@/components/search/search-filters"
import { PropertyGrid } from "@/components/search/property-grid"
import { UserNav } from "@/components/auth/user-nav"
import { prisma } from "@/lib/prisma"
import { Home } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
  searchParams: {
    city?: string
    minRent?: string
    maxRent?: string
    bedrooms?: string
    bathrooms?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const where: any = {
    isAvailable: true,
  }

  if (searchParams.city) {
    where.city = {
      contains: searchParams.city,
      mode: "insensitive",
    }
  }

  if (searchParams.minRent || searchParams.maxRent) {
    where.rent = {}
    if (searchParams.minRent) where.rent.gte = Number.parseFloat(searchParams.minRent)
    if (searchParams.maxRent) where.rent.lte = Number.parseFloat(searchParams.maxRent)
  }

  if (searchParams.bedrooms) {
    where.bedrooms = { gte: Number.parseInt(searchParams.bedrooms) }
  }

  if (searchParams.bathrooms) {
    where.bathrooms = { gte: Number.parseInt(searchParams.bathrooms) }
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      images: true,
      landlord: {
        select: { name: true, email: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">FlatRental</span>
          </Link>
          <UserNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Properties</h1>
          <p className="text-muted-foreground">
            Found {properties.length} properties
            {searchParams.city && ` in ${searchParams.city}`}
          </p>
        </div>

        <div className="space-y-6">
          <SearchFilters />
          <Suspense fallback={<div>Loading properties...</div>}>
            <PropertyGrid properties={properties} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
