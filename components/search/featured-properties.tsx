import { prisma } from "@/lib/prisma"
import { PropertyGrid } from "./property-grid"

export async function FeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: { isAvailable: true },
    include: {
      images: true,
      landlord: {
        select: { name: true, email: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  })

  return <PropertyGrid properties={properties} />
}
