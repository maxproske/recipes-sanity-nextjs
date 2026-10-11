import React from 'react'
import PropTypes from 'prop-types'
import { PencilSquareIcon } from '@heroicons/react/20/solid'

const STUDIO_URL =
  'https://www.sanity.io/@odZJRPoo5/studio/c8c1a43fab9eb0095149bc69/recipes/structure/recipes'

// Shown to everyone: the Studio sits behind Sanity login, so a guest who taps
// it just lands on a login page.
export default function EditInStudio({ documentId }) {
  if (!documentId) return null

  // Preview mode serves drafts, whose ids carry a "drafts." prefix the Studio
  // URL doesn't want.
  const id = documentId.replace(/^drafts\./, '')

  return (
    <a
      href={`${STUDIO_URL};${id}`}
      target="_blank"
      rel="noopener"
      aria-label="Edit in Sanity Studio"
      title="Edit in Sanity Studio"
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white border border-caramel-300 text-caramel-700 hover:bg-caramel-100 hover:scale-105 transition duration-100"
    >
      <PencilSquareIcon className="w-5 h-5" />
    </a>
  )
}

EditInStudio.propTypes = {
  documentId: PropTypes.string,
}
