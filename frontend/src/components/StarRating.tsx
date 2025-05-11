import { useState } from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  setRating?: (rating: number) => void
}

export function StarRating({
  rating,
  size = 'md',
  setRating
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  const [hoverRating, setHoverRating] = useState<number | null>(null)

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`${sizeClasses[size]} ${
            index < (hoverRating ?? rating)
              ? 'text-yellow-500'
              : 'text-gray-200'
          } ${setRating ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => setRating?.(index + 1)}
          onMouseEnter={() => setRating && setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(null)}
        >
          ★
        </span>
      ))}
    </div>
  )
}
