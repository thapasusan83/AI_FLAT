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

    const { approved } = await request.json()

    if (approved) {
      const updatedReview = await prisma.review.update({
        where: { id: params.id },
        data: { isApproved: true },
      })
      return NextResponse.json({ message: "Review approved successfully", review: updatedReview })
    } else {
      await prisma.review.delete({
        where: { id: params.id },
      })
      return NextResponse.json({ message: "Review rejected and deleted successfully" })
    }
  } catch (error) {
    console.error("Error moderating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
