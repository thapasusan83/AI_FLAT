import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isAvailable } = await request.json()

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: { isAvailable },
    })

    return NextResponse.json({ message: "Property availability updated successfully", property: updatedProperty })
  } catch (error) {
    console.error("Error updating property availability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
