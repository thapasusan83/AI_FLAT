import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  rent: z.string().transform((val) => Number.parseFloat(val)),
  bedrooms: z.string().transform((val) => Number.parseInt(val)),
  bathrooms: z.string().transform((val) => Number.parseInt(val)),
  availableFrom: z.string().transform((val) => new Date(val)),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "LANDLORD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())

    // Extract non-image fields
    const propertyData = {
      title: data.title as string,
      description: data.description as string,
      address: data.address as string,
      city: data.city as string,
      postalCode: data.postalCode as string,
      rent: data.rent as string,
      bedrooms: data.bedrooms as string,
      bathrooms: data.bathrooms as string,
      availableFrom: data.availableFrom as string,
    }

    const validatedData = propertySchema.parse(propertyData)

    // Create property
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        landlordId: session.user.id,
      },
    })

    // Handle image uploads (simplified - in production, use cloud storage)
    const imageUrls: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image-") && value instanceof File) {
        // In a real app, upload to cloud storage and get URL
        // For now, we'll use placeholder URLs
        imageUrls.push(`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.title)}`)
      }
    }

    // Create property images
    if (imageUrls.length > 0) {
      await prisma.propertyImage.createMany({
        data: imageUrls.map((url, index) => ({
          propertyId: property.id,
          imageUrl: url,
          isPrimary: index === 0,
        })),
      })
    }

    return NextResponse.json({ message: "Property created successfully", property }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Property creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const minRent = searchParams.get("minRent")
    const maxRent = searchParams.get("maxRent")
    const bedrooms = searchParams.get("bedrooms")
    const bathrooms = searchParams.get("bathrooms")

    const where: any = {
      isAvailable: true,
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      }
    }

    if (minRent || maxRent) {
      where.rent = {}
      if (minRent) where.rent.gte = Number.parseFloat(minRent)
      if (maxRent) where.rent.lte = Number.parseFloat(maxRent)
    }

    if (bedrooms) {
      where.bedrooms = Number.parseInt(bedrooms)
    }

    if (bathrooms) {
      where.bathrooms = Number.parseInt(bathrooms)
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        landlord: {
          select: {
            name: true,
            email: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Properties fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
