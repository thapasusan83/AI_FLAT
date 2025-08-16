import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { PropertyGrid } from "@/components/search/property-grid"
import { SearchFilters } from "@/components/search/search-filters"
import { UserBookings } from "@/components/tenant/user-bookings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/auth/user-nav"
import { Home, Calendar, Heart } from "lucide-react"

export default async function Dashboard() {
  const user = await requireAuth()

  const [properties, userBookings] = await Promise.all([
    prisma.property.findMany({
      where: { isAvailable: true },
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
      take: 12,
    }),
    prisma.booking.findMany({
      where: { tenantId: user.id },
      include: {
        property: {
          include: {
            images: true,
            landlord: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">FlatRental</span>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Find your perfect home or manage your bookings</p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Search Properties</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Properties</CardTitle>
                <CardDescription>Find properties that match your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchFilters />
              </CardContent>
            </Card>
            <PropertyGrid properties={properties} />
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>Track your booking requests and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <UserBookings bookings={userBookings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Properties</CardTitle>
                <CardDescription>Properties you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No favorite properties yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
