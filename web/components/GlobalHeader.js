import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

function GlobalHeader() {
  const router = useRouter()

  return (
    <header className="p-4 flex items-center justify-center border-b border-caramel-200 text-caramel-500">
      <div className="flex items-center justify-between w-full max-w-4xl label">
        {router && router.route !== '/' && (
          <Link href="/" className="flex items-center">
              <ChevronLeftIcon className="w-4 h-auto mr-1" />
              Home
          </Link>
        )}
        <span className="ml-auto">Proske, Swanson & Mahato</span>
      </div>
    </header>
  )
}

export default GlobalHeader
