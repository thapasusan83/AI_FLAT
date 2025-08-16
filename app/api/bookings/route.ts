import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const bookingSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  totalAmount: z.number().positive("Total amount must be positive"),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId, startDate, endDate, totalAmount, message } = bookingSchema.parse(body)

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (!property.isAvailable) {
      return NextResponse.json({ error: "Property is not available" }, { status: 400 })
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: "APPROVED",
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    })

    if (overlappingBooking) {
      return NextResponse.json({ error: "Property is already booked for these dates" }, { status: 400 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        tenantId: session.user.id,
        startDate,
        endDate,
        totalAmount,
        message,
        status: "PENDING",
      },
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
    })

    return NextResponse.json({ message: "Booking request sent successfully", booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
