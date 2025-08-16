import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, Calendar, Star } from "lucide-react"

interface AdminStatsProps {
  stats: {
    totalUsers: number
    tenants: number
    landlords: number
    totalProperties: number
    availableProperties: number
    totalBookings: number
    pendingBookings: number
    totalReviews: number
    pendingReviews: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: `${stats.tenants} tenants, ${stats.landlords} landlords`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Properties",
      value: stats.totalProperties,
      subtitle: `${stats.availableProperties} available`,
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      subtitle: `${stats.pendingBookings} pending`,
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Reviews",
      value: stats.totalReviews,
      subtitle: `${stats.pendingReviews} pending approval`,
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
