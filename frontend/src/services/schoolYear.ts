// Helper function to get school year from a date
export const getSchoolYear = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() returns 0-11

  // If month is September or later, it's the start of the next school year
  if (month >= 9) {
    return `${year}/${year + 1}`
  } else {
    return `${year - 1}/${year}`
  }
}

// Helper function to get current school year
export const getCurrentSchoolYear = (): string => {
  return getSchoolYear(new Date())
}

// Helper function to check if a school year is outdated
export const isSchoolYearOutdated = (schoolYear: string): boolean => {
  const currentYear = getCurrentSchoolYear()
  const [currentStart] = currentYear.split('/').map(Number)
  const [, yearEnd] = schoolYear.split('/').map(Number)

  // A school year is outdated if it's more than 2 years behind the current one
  return yearEnd < currentStart - 1
}
