// src/components/common/ProductImage.tsx

'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export default function ProductImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  priority = false,
  fill = false
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder-product.png')
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    setImgSrc('/placeholder-product.png')
  }

  // If no src provided, show placeholder immediately
  if (!src) {
    return (
      <div className={`relative bg-gray-100 flex items-center justify-center ${className}`}>
        {fill ? (
          <Image
            src="/placeholder-product.png"
            alt={alt}
            fill
            className="object-contain p-4"
          />
        ) : (
          <Image
            src="/placeholder-product.png"
            alt={alt}
            width={width}
            height={height}
            className="object-contain p-4"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-sm">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`object-cover ${hasError ? 'object-contain p-4' : ''}`}
          onError={handleError}
          priority={priority}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${hasError ? 'object-contain p-4' : ''}`}
          onError={handleError}
          priority={priority}
        />
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-sm">Image not available</p>
        </div>
      )}
    </div>
  )
}