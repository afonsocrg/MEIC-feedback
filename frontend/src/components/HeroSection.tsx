type ActionButtonProps = {
  label: string
  description: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

function ActionButton({
  label,
  description,
  onClick,
  variant = 'primary'
}: ActionButtonProps) {
  const buttonClasses =
    variant === 'primary'
      ? 'bg-istBlue hover:bg-istBlueDark text-white'
      : 'bg-white border-2 border-istBlue text-istBlue hover:bg-istBlue hover:text-white'

  const commonClasses =
    'font-semibold py-3 w-full max-w-[180px] rounded-lg shadow transition-all text-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:ring-offset-2'

  return (
    <div className="flex flex-col items-center w-full max-w-[180px]">
      <button onClick={onClick} className={`${buttonClasses} ${commonClasses}`}>
        {label}
      </button>
      <span className="text-gray-400 text-xs md:text-sm font-medium w-full max-w-[180px] text-center mt-2 break-words">
        {description}
      </span>
    </div>
  )
}

export function HeroSection() {
  return (
    <div className="bg-blue-50 py-12 px-4 md:px-0 mb-10 rounded-b-3xl shadow-sm">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-istBlue mb-4">
          Find the best MEIC courses
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl">
          Honest, anonymous student reviews to help you choose the right
          courses.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-2 items-center justify-center">
          <ActionButton
            label="Browse Courses"
            description="See what students really think about each course."
            onClick={() => {
              const el = document.getElementById('course-list')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="primary"
          />
          <ActionButton
            label="Give a review"
            description="Help your peers by sharing your honest review!"
            onClick={() => {
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=dialog',
                '_blank',
                'noopener,noreferrer'
              )
            }}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}
