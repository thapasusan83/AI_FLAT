"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Star } from "lucide-react"
import type { Review, Property, User } from "@prisma/client"

interface ReviewWithDetails extends Review {
  property: Property
  tenant: User
}

export function ReviewModeration() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingReviews()
  }, [])

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const moderateReview = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      })
      if (response.ok) {
        fetchPendingReviews()
      }
    } catch (error) {
      console.error("Error moderating review:", error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return <div>Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pending reviews to moderate.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{review.property.title}</CardTitle>
                <CardDescription>
                  Review by {review.tenant.name || "Anonymous"} • {review.createdAt.toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant={review.isApproved ? "default" : "secondary"}>
                {review.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
            </div>

            {review.reviewText && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{review.reviewText}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={() => moderateReview(review.id, true)} disabled={review.isApproved}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button variant="destructive" size="sm" onClick={() => moderateReview(review.id, false)}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
