import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  reviewText: z.string().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId, rating, reviewText } = reviewSchema.parse(body)

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user has completed booking for this property
    const completedBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        tenantId: session.user.id,
        status: "APPROVED",
        endDate: { lt: new Date() }, // Booking has ended
      },
    })

    if (!completedBooking) {
      return NextResponse.json({ error: "You can only review properties you have rented" }, { status: 400 })
    }

    // Check if user has already reviewed this property
    const existingReview = await prisma.review.findFirst({
      where: {
        propertyId,
        tenantId: session.user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this property" }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        propertyId,
        tenantId: session.user.id,
        rating,
        reviewText,
        isApproved: false, // Reviews need admin approval
      },
    })

    return NextResponse.json(
      { message: "Review submitted successfully. It will be visible after approval.", review },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Review creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
