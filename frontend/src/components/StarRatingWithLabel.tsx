import { useState } from 'react'
import { StarRating } from './StarRating'

type RatingLabel = [string, string, string, string, string]

const RATING_LABELS: RatingLabel = [
  'Terrible',
  'Poor',
  'Average',
  'Good',
  'Excellent'
]

interface StarRatingWithLabelProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  labels?: RatingLabel
  displayHover?: boolean
}

export function StarRatingWithLabel({
  value,
  onChange,
  size,
  labels,
  displayHover = true
}: StarRatingWithLabelProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  if (!labels) {
    labels = RATING_LABELS
  }

  const displayValue = displayHover && hoverValue ? hoverValue : value
  const label =
    displayValue >= 1 && displayValue <= 5 ? labels[displayValue - 1] : null

  return (
    <div className="flex items-center gap-3">
      <StarRating
        value={value}
        onChange={onChange}
        onHover={setHoverValue}
        hoverValue={hoverValue}
        size={size}
      />
      {label && (
        <span className="text-sm text-gray-500 min-w-[70px]">{label}</span>
      )}
    </div>
  )
}
