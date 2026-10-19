import { Activity, MapPin, Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  { title: 'Users', description: 'Registered accounts', icon: Users },
  { title: 'Locations', description: 'Points on the map', icon: MapPin },
  { title: 'Activity', description: 'Events in the last 24h', icon: Activity },
]

export function DashboardPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of the Map platform.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <stat.icon className="size-4 text-muted-foreground" />
                {stat.title}
              </CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">—</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
