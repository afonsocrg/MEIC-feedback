import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface MarkdownProps {
  children: string
  className?: string
}

const Markdown: React.FC<MarkdownProps> = ({ children, className = '' }) => {
  return (
    <div className={`prose prose-sm text-gray-600 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              className="text-istBlue hover:underline"
              target="_blank"
            />
          )
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
