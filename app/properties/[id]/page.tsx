import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-utils"
import { PropertyGallery } from "@/components/property/property-gallery"
import { PropertyDetails } from "@/components/property/property-details"
import { PropertyReviews } from "@/components/property/property-reviews"
import { BookingSection } from "@/components/property/booking-section"
import { UserNav } from "@/components/auth/user-nav"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PropertyPageProps {
  params: { id: string }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const user = await getCurrentUser()

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      landlord: {
        select: { name: true, email: true, id: true },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          tenant: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { reviews: true },
      },
    },
  })

  if (!property) {
    notFound()
  }

  // Check if user has completed booking for this property (for review eligibility)
  const userBooking = user
    ? await prisma.booking.findFirst({
        where: {
          propertyId: property.id,
          tenantId: user.id,
          status: "APPROVED",
          endDate: { lt: new Date() }, // Booking has ended
        },
      })
    : null

  // Check if user has already reviewed this property
  const existingReview = user
    ? await prisma.review.findFirst({
        where: {
          propertyId: property.id,
          tenantId: user.id,
        },
      })
    : null

  const canReview = userBooking && !existingReview && user?.role === "TENANT"

  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length
      : 0

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
        <div className="mb-6">
          <Link href="/search">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery images={property.images} title={property.title} />
            <PropertyDetails property={property} averageRating={averageRating} />
            <Separator />
            <PropertyReviews
              reviews={property.reviews}
              averageRating={averageRating}
              totalReviews={property._count.reviews}
              canReview={canReview}
              propertyId={property.id}
            />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSection property={property} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
