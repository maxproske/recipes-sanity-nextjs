import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function testHref(href) {
  if (!href || typeof href !== 'string') return {}
  if (href.startsWith('/')) return { path: href }

  const hrefUrl = new URL(href)

  if (!hrefUrl.host.startsWith('candicorp.sanity.build')) {
    return {
      url: hrefUrl.toString(),
    }
  }

  return {
    path: hrefUrl.pathname,
  }
}

export default function ConditionalLink({
  href,
  children,
  className,
  onClick,
}) {
  const { path, url } = testHref(href)
  const { asPath } = useRouter()

  if (url)
    return (
      <a
        onClick={() => onClick}
        className={className}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )

  if (!path) return null

  return (
    <Link
      href={path ?? ''}
      onClick={onClick}
      className={`${className} ${path === asPath ? `active` : ``}`}
    >
      {children}
    </Link>
  )
}

ConditionalLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}
