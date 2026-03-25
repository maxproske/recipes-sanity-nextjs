import React from 'react'

const LinkRender = ({ children }) => <span>{children} 🌍</span>

export default {
  title: 'URL',
  name: 'link',
  type: 'object',
  icon: () => '🌍',
  fields: [
    {
      title: 'URL',
      name: 'href',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['https', 'http', 'mailto', 'tel'],
        }),
    },
  ],
}
