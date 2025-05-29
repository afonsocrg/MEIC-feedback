import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useApp } from '@hooks/useApp'
import { DegreeCard } from './DegreeCard'

interface DegreeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function DegreeSelector({ isOpen, onClose }: DegreeSelectorProps) {
  const { degrees, setSelectedDegreeId } = useApp()

  const handleDegreeSelect = (degreeId: number) => {
    setSelectedDegreeId(degreeId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Degree</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {degrees.map((degree) => (
            <DegreeCard
              key={degree.id}
              degree={degree}
              onClick={() => handleDegreeSelect(degree.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
