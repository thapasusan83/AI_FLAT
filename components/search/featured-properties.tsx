import { PropertyGrid } from "./property-grid"

export async function FeaturedProperties() {
  // Mock data to replace Prisma call until database is properly set up
  const properties = [
    {
      id: "1",
      title: "Modern Downtown Apartment",
      description: "Beautiful 2-bedroom apartment in the heart of the city",
      price: 1200,
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      city: "New York",
      address: "123 Main St",
      images: [{ url: "/modern-downtown-apartment.png" }],
      landlord: { name: "John Doe", email: "john@example.com" },
      _count: { reviews: 5 },
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Cozy Studio Near Park",
      description: "Perfect studio apartment with park views",
      price: 900,
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      city: "San Francisco",
      address: "456 Park Ave",
      images: [{ url: "/cozy-studio-apartment-park.png" }],
      landlord: { name: "Jane Smith", email: "jane@example.com" },
      _count: { reviews: 3 },
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Luxury Penthouse",
      description: "Stunning penthouse with city skyline views",
      price: 2500,
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      city: "Miami",
      address: "789 Ocean Dr",
      images: [{ url: "/luxury-penthouse.png" }],
      landlord: { name: "Mike Johnson", email: "mike@example.com" },
      _count: { reviews: 8 },
      isAvailable: true,
      createdAt: new Date(),
    },
  ]

  return <PropertyGrid properties={properties} />
}
