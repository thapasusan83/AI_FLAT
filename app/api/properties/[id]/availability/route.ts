import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isAvailable } = await request.json()

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.landlordId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: { isAvailable },
    })

    return NextResponse.json({ message: "Availability updated successfully", property: updatedProperty })
  } catch (error) {
    console.error("Availability update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
