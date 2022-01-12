import { useRouter } from 'next/router'
import React from 'react'

import Button from './Button'

export default function ExitPreview() {
  const { route, asPath } = useRouter()
  const exitUrl = `/api/exit-preview?slug=${route === '/404' ? '/' : asPath}`

  return (
    <div className="fixed inset-0 z-50 flex justify-start items-end pointer-events-none p-2 md:p-4">
      <Button className="flex flex-col pointer-events-auto" href={exitUrl}>
        Exit Preview Mode
      </Button>
    </div>
  )
}
