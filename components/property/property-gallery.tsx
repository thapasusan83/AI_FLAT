"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"
import type { PropertyImage } from "@prisma/client"

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const primaryImage = images.find((img) => img.isPrimary) || images[0]
  const otherImages = images.filter((img) => !img.isPrimary).slice(0, 4)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {/* Main Image */}
        <div className="col-span-4 md:col-span-2 md:row-span-2 relative">
          <img
            src={primaryImage?.imageUrl || "/placeholder.svg?height=400&width=600&query=apartment"}
            alt={title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          />
        </div>

        {/* Thumbnail Images */}
        {otherImages.map((image, index) => (
          <div key={image.id} className="aspect-square relative">
            <img
              src={image.imageUrl || "/placeholder.svg?height=200&width=200&query=room"}
              alt={`${title} - Image ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setSelectedImage(images.findIndex((img) => img.id === image.id))
                setIsGalleryOpen(true)
              }}
            />
            {index === 3 && images.length > 5 && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
              >
                <div className="text-white text-center">
                  <Grid3X3 className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">+{images.length - 5} more</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <img
              src={images[selectedImage]?.imageUrl || "/placeholder.svg"}
              alt={`${title} - Image ${selectedImage + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
