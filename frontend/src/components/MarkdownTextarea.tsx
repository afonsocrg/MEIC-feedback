import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@components'
import { Textarea } from '@ui'

export function MarkdownTextarea({
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <div className="w-full border rounded-md bg-white shadow-sm">
      <Tabs defaultValue="markdown" className="gap-0">
        <div className="flex bg-gray-100">
          <TabsList className="flex border-b px-2 bg-transparent">
            <TabsTrigger value="markdown" className="px-4 py-2 font-medium">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="px-4 py-2 font-medium">
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="markdown">
          <Textarea
            {...props}
            className="w-full min-h-[120px] rounded-md rounded-t-none p-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder={
              props.placeholder || 'Use Markdown to format your comment'
            }
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="w-full min-h-[120px] border rounded-md rounded-t-none p-2 bg-gray-50 text-gray-800 whitespace-pre-wrap">
            <Markdown>{String(props.value)}</Markdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
