import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  id: string
  title: string
  subtitle: string
  badge: string
  timestamp: Date
}

interface RecentActivityProps {
  title: string
  items: ActivityItem[]
}

export function RecentActivity({ title, items }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
                <p className="text-xs text-muted-foreground">{item.timestamp.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
