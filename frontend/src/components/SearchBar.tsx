import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type SortOption = 'rating' | 'alphabetical' | 'reviews'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
  selectedSpecialization: number | null
  setSelectedSpecialization: (specialization: number | null) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  availablePeriods: string[]
  specializations: Array<{ id: number; name: string }>
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedPeriod,
  setSelectedPeriod,
  selectedSpecialization,
  setSelectedSpecialization,
  sortBy,
  setSortBy,
  availablePeriods,
  specializations
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedPeriod('')
    setSelectedSpecialization(null)
    setSortBy('rating')
  }

  const hasActiveFilters =
    selectedPeriod !== '' || selectedSpecialization !== null

  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-4 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              id="search"
              type="text"
              placeholder="Search by name or acronym..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`self-end px-4 py-2 text-sm font-medium focus:outline-none flex items-center gap-2 ${
              hasActiveFilters
                ? 'text-istBlue bg-blue-50 rounded-lg border border-blue-100'
                : 'text-istBlue hover:text-istBlueDark'
            }`}
          >
            <span>
              {isExpanded
                ? 'Hide Filters'
                : hasActiveFilters
                  ? 'Filters Active'
                  : 'Show Filters'}
            </span>
            {hasActiveFilters && !isExpanded && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-istBlue text-white rounded-full">
                {(selectedPeriod !== '' ? 1 : 0) +
                  (selectedSpecialization !== null ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 pt-4 pb-2 px-2">
                <div className="flex-1 flex flex-col min-w-[120px]">
                  <label
                    htmlFor="period"
                    className="text-xs font-semibold text-gray-500 mb-1"
                  >
                    Period
                  </label>
                  <select
                    id="period"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="">All</option>
                    {availablePeriods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col min-w-[160px]">
                  <label
                    htmlFor="specialization"
                    className="text-xs font-semibold text-gray-500 mb-1"
                  >
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                    value={selectedSpecialization ?? ''}
                    onChange={(e) =>
                      setSelectedSpecialization(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">All</option>
                    {specializations.map((specialization) => (
                      <option key={specialization.id} value={specialization.id}>
                        {specialization.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col min-w-[160px]">
                  <label
                    htmlFor="sort"
                    className="text-xs font-semibold text-gray-500 mb-1"
                  >
                    Sort by
                  </label>
                  <select
                    id="sort"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end min-w-[120px] mt-2 md:mt-0">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
