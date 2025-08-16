import { requireRole } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserNav } from "@/components/auth/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { PropertyManagement } from "@/components/admin/property-management"
import { BookingManagement } from "@/components/admin/booking-management"
import { ReviewModeration } from "@/components/admin/review-moderation"
import { Home, Users, Building, Calendar, Star, BarChart3 } from "lucide-react"

export default async function AdminDashboard() {
  const user = await requireRole(["ADMIN"])

  const [stats, recentUsers, recentProperties, recentBookings, pendingReviews] = await Promise.all([
    // Get system statistics
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "TENANT" } }),
      prisma.user.count({ where: { role: "LANDLORD" } }),
      prisma.property.count(),
      prisma.property.count({ where: { isAvailable: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.review.count(),
      prisma.review.count({ where: { isApproved: false } }),
    ]).then(
      ([
        totalUsers,
        tenants,
        landlords,
        totalProperties,
        availableProperties,
        totalBookings,
        pendingBookings,
        totalReviews,
        pendingReviews,
      ]) => ({
        totalUsers,
        tenants,
        landlords,
        totalProperties,
        availableProperties,
        totalBookings,
        pendingBookings,
        totalReviews,
        pendingReviews,
      }),
    ),

    // Recent users
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),

    // Recent properties
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        landlord: {
          select: { name: true, email: true },
        },
      },
    }),

    // Recent bookings
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: {
          select: { title: true },
        },
        tenant: {
          select: { name: true, email: true },
        },
      },
    }),

    // Pending reviews
    prisma.review.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: {
          select: { title: true },
        },
        tenant: {
          select: { name: true },
        },
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">FlatRental Admin</span>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, properties, and platform operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity
                title="Recent Users"
                items={recentUsers.map((user) => ({
                  id: user.id,
                  title: user.name || "Unknown",
                  subtitle: user.email,
                  badge: user.role,
                  timestamp: user.createdAt,
                }))}
              />
              <RecentActivity
                title="Recent Properties"
                items={recentProperties.map((property) => ({
                  id: property.id,
                  title: property.title,
                  subtitle: `${property.city} - $${property.rent}/mo`,
                  badge: property.isAvailable ? "Available" : "Unavailable",
                  timestamp: property.createdAt,
                }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>Review and manage property listings</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Monitor and manage all booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Review Moderation</CardTitle>
                <CardDescription>Approve or reject user reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewModeration />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
