export default {
  widgets: [
    { name: 'structure-menu' },
    {
      name: 'project-info',
      options: {
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/SimeonGriggs/recipes-sanity-nextjs',
            category: 'Code',
          },
          {
            title: 'Frontend',
            value: 'https://recipes.simeongriggs.dev',
            category: 'apps',
          },
        ],
      },
    },
    { name: 'project-users', layout: { height: 'auto' } },
    {
      name: 'document-list',
      options: {
        title: 'Recently edited',
        order: '_updatedAt desc',
        limit: 10,
        types: ['recipe'],
      },
      layout: { width: 'medium' },
    },
  ],
}
