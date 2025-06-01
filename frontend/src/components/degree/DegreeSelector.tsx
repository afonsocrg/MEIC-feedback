import { SearchDegrees } from '@components'
import { useApp } from '@hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui'
import { useEffect, useState } from 'react'
import { DegreeCard } from './DegreeCard'

interface DegreeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function DegreeSelector({ isOpen, onClose }: DegreeSelectorProps) {
  const { degrees, setSelectedDegreeId } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  // Reset search query when dialog is opened
  // If we do it when the user clicks on a degree, we briefly see
  // all the courses coming back while the dialog is closing.
  // For that reason, this is inside a useEffect.
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  const handleDegreeSelect = (degreeId: number) => {
    setSelectedDegreeId(degreeId)
    onClose()
  }

  const filteredDegrees = degrees.filter((degree) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      degree.name.toLowerCase().includes(searchLower) ||
      degree.acronym.toLowerCase().includes(searchLower)
    )
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Degree</DialogTitle>
        </DialogHeader>
        <SearchDegrees
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="flex-1 min-h-0 mt-4 overflow-y-auto">
          {filteredDegrees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No degrees found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDegrees.map((degree) => (
                <DegreeCard
                  key={degree.id}
                  degree={degree}
                  onClick={() => handleDegreeSelect(degree.id)}
                  className="min-w-[320px]"
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
