import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronLeftSolid } from '@graywolfai/react-heroicons'

function GlobalHeader() {
  const router = useRouter()

  return (
    <header className="p-4 flex items-center justify-center border-b border-caramel-200 text-caramel-500">
      <div className="flex items-center justify-between w-full max-w-4xl label">
        {router && router.route !== '/' && (
          <Link href="/">
            <a className="flex items-center">
              <ChevronLeftSolid className="w-4 h-auto mr-1" />
              Home
            </a>
          </Link>
        )}
        <span className="ml-auto">Recipe Website</span>
      </div>
    </header>
  )
}

export default GlobalHeader
