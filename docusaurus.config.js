// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// See: https://docusaurus.io/docs/api/docusaurus-config

const config = {
  title: 'Integration Dokumenter',
  tagline: 'Official API Guide for scoring apps',
  favicon: 'img/favicon.ico',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Fremtidssikring til Docusaurus v4
  future: {
    v4: true,
  },

  url: 'https://dansk-golf-union.github.io',
  baseUrl: '/dgu-integration/',

  organizationName: 'Dansk-Golf-Union',
  projectName: 'dgu-integration',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Dokumentation er på forsiden
          editUrl: undefined, // Fjerner "Edit this page"
        },
        blog: false, // Blog er slået fra
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Integration Dokumenter',
      logo: {
        alt: 'DGU Logo',
        src: 'img/dgu-logo.png', // 👈 sørg for at billedet ligger i static/img
},
      items: [
        {
          type: 'doc',
          docId: 'index',
          position: 'left',
          label: 'API Guide',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Dansk Golf Union.`,
    },
  },
};

module.exports = config;
