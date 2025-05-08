import React, { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 mt-2 text-sm text-white bg-gray-900 rounded-md shadow-lg left-1/2 -translate-x-1/2 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  )
}
