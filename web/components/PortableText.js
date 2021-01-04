import React from 'react'
import PropTypes from 'prop-types'
import BlockContent from '@sanity/block-content-to-react'
import client from '../client'
import serializers from './serializers'

const { projectId, dataset } = client.config()
function PortableText({ blocks }) {
  if (!blocks) {
    console.error('Missing blocks')
    return null
  }

  return (
    <BlockContent
      className="prose text-caramel-800"
      blocks={blocks}
      serializers={serializers}
      projectId={projectId}
      dataset={dataset}
    />
  )
}

PortableText.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object),
}

export default PortableText
