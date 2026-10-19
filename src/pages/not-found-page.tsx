import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Button variant="outline" asChild>
        <Link to="/">
          <ArrowLeft data-icon="inline-start" />
          Back to dashboard
        </Link>
      </Button>
    </div>
  )
}
