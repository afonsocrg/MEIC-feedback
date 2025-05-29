interface ChipProps {
  label: string
  className?: string
  onClick?: () => void
}

// A set of nice, accessible colors that work well together
const CHIP_COLORS = [
  { bg: '#E3F2FD', text: '#1976D2' }, // Blue
  { bg: '#E8F5E9', text: '#2E7D32' }, // Green
  { bg: '#FFF3E0', text: '#E65100' }, // Orange
  { bg: '#F3E5F5', text: '#7B1FA2' }, // Purple
  { bg: '#FFEBEE', text: '#C62828' }, // Red
  { bg: '#E0F7FA', text: '#00838F' }, // Cyan
  { bg: '#F1F8E9', text: '#558B2F' }, // Light Green
  { bg: '#FFF8E1', text: '#F57F17' }, // Amber
  { bg: '#EDE7F6', text: '#4527A0' }, // Deep Purple
  { bg: '#E8EAF6', text: '#283593' } // Indigo
]

const getColorForLabel = (label: string) => {
  // Create a simple hash of the label to get a consistent index
  const hash = label.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Use the absolute value of the hash to get a positive index
  const index = Math.abs(hash) % CHIP_COLORS.length
  return CHIP_COLORS[index]
}

interface ChipProps {
  label: string
  className?: string
  onClick?: () => void
}

export function Chip({ label, className = '', onClick }: ChipProps) {
  const { bg, text } = getColorForLabel(label)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: bg, color: text }}
      onClick={onClick}
    >
      {label}
    </span>
  )
}
