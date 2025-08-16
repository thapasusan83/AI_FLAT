"use client"

import { useState } from "react"
import { ReviewForm } from "./review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Plus } from "lucide-react"
import type { Review } from "@prisma/client"

interface ReviewWithTenant extends Review {
  tenant: {
    name: string | null
  }
}

interface PropertyReviewsProps {
  reviews: ReviewWithTenant[]
  averageRating: number
  totalReviews: number
  canReview: boolean
  propertyId: string
}

export function PropertyReviews({ reviews, averageRating, totalReviews, canReview, propertyId }: PropertyReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      distribution[review.rating - 1]++
    })
    return distribution.reverse() // 5 stars first
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews ({totalReviews})</CardTitle>
          {canReview && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showReviewForm && (
          <div className="border rounded-lg p-4">
            <ReviewForm propertyId={propertyId} onSuccess={() => setShowReviewForm(false)} />
          </div>
        )}

        {reviews.length > 0 && (
          <>
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                <div className="text-sm text-muted-foreground">{totalReviews} reviews</div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars, index) => (
                  <div key={stars} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{stars}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${reviews.length > 0 ? (ratingDistribution[index] / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{ratingDistribution[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{review.tenant.name || "Anonymous"}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {review.reviewText && <p className="text-muted-foreground leading-relaxed">{review.reviewText}</p>}
                  <Separator />
                </div>
              ))}
            </div>
          </>
        )}

        {reviews.length === 0 && !showReviewForm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Be the first to review this property!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
