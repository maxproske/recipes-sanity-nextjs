export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-nextjs-landing-pages',
      },
    },
    { name: 'structure-menu' },
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '5fdfa6eb79b527aa184e8a70',
                  title: 'Sanity Studio',
                  name: 'recipes-sanity-nextjs-studio',
                  apiId: 'dcf7a690-df4d-4d99-9cda-f88df75aaacd',
                },
                {
                  buildHookId: '5fdfa6eb714dafca892c5951',
                  title: 'Landing pages Website',
                  name: 'recipes-sanity-nextjs',
                  apiId: '9fc90b2a-59ec-49cd-8734-95986d143b3b',
                },
              ],
            },
          },
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/SimeonGriggs/recipes-sanity-nextjs',
            category: 'Code',
          },
          {
            title: 'Frontend',
            value: 'https://recipes-sanity-nextjs.netlify.app',
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
        types: ['page'],
      },
      layout: { width: 'medium' },
    },
  ],
}
