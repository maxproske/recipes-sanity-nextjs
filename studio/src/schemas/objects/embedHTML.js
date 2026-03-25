export default {
  name: 'embedHTML',
  title: 'Embed HTML',
  type: 'object',
  fields: [
    {
      name: 'html',
      title: 'HTML',
      type: 'text',
      description:
        'You usually want to avoid storing freeform HTML, but for embed codes it can be useful.',
    },
  ],
  preview: {
    select: {
      html: 'html',
    },
    prepare({ html }) {
      return {
        title: html ? html.substring(0, 80) : 'No HTML',
        subtitle: 'Embed HTML',
      }
    },
  },
}
