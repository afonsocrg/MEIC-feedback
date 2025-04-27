import React from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`${sizeClasses[size]} ${
            index < rating ? 'text-yellow-500' : 'text-gray-200'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating
