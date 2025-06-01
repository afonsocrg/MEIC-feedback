interface SearchDegreesProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function SearchDegrees({
  searchQuery,
  setSearchQuery
}: SearchDegreesProps) {
  return (
    <div className="mt-2">
      <input
        type="text"
        placeholder="Search by name or acronym..."
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
