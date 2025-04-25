import { Star } from 'lucide-react'
import React from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  interactive = false,
  onChange
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-6 w-6'
      default:
        return 'h-5 w-5'
    }
  }

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < rating
    return (
      <button
        key={i}
        onClick={() => interactive && onChange?.(i + 1)}
        className={`${
          interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        } transition-transform`}
        type={interactive ? 'button' : undefined}
      >
        <Star
          className={`${getSizeClass()} ${
            filled ? 'fill-[#fba72f] text-[#fba72f]' : 'fill-none text-gray-300'
          }`}
        />
      </button>
    )
  })

  return <div className="flex gap-1">{stars}</div>
}

export default StarRating
