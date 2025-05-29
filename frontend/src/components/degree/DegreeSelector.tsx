import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useApp } from '@hooks'
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
      <DialogContent className="!max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Degree</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {degrees.map((degree) => (
            <DegreeCard
              key={degree.id}
              degree={degree}
              onClick={() => handleDegreeSelect(degree.id)}
              className="min-w-[320px]"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
