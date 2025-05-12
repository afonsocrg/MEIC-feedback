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
  hoverValue?: number | null
  onChange?: (value: number) => void
  onHover?: (value: number | null) => void
  size?: 'sm' | 'md' | 'lg'
  labels?: RatingLabel
}

export function StarRatingWithLabel({
  value,
  hoverValue,
  onChange,
  onHover,
  size,
  labels
}: StarRatingWithLabelProps) {
  if (!labels) {
    labels = RATING_LABELS
  }

  const displayValue = hoverValue ?? value
  const label =
    displayValue >= 1 && displayValue <= 5
      ? (labels?.[displayValue - 1] ?? RATING_LABELS[displayValue - 1])
      : ''

  return (
    <div className="flex items-center gap-3">
      <StarRating
        value={value}
        onChange={onChange}
        onHover={onHover}
        hoverValue={hoverValue}
        size={size}
      />
      {label && (
        <span className="text-sm text-gray-500 min-w-[70px]">{label}</span>
      )}
    </div>
  )
}
