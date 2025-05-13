import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@components'
import { Textarea } from '@ui'

export function MarkdownTextarea({
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <div className="w-full border rounded-md bg-white">
      <Tabs defaultValue="markdown" className="gap-0">
        <div className="flex items-center justify-between py-1 px-3">
          <TabsList className="flex space-x-1 rounded-none bg-transparent">
            <TabsTrigger
              value="markdown"
              className="px-4 py-2 font-medium rounded-full data-[state=active]:bg-gray-100"
            >
              Write
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="px-4 py-2 font-medium rounded-full data-[state=active]:bg-gray-100"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="markdown">
          <Textarea
            {...props}
            className="w-full min-h-[120px] rounded-md rounded-t-none p-2 resize-y "
            placeholder={
              props.placeholder || 'Use Markdown to format your comment'
            }
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="w-full min-h-[120px] border rounded-md rounded-t-none p-2">
            <Markdown className="markdown-compact">
              {String(props.value || 'Nothing to preview...')}
            </Markdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
