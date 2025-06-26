/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 */

 module.exports = {
  tutorialSidebar: [
    'index', // Velkommen øverst
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'integration-guide',
        'member-lookup',
        'oauth-guide',
      ],
    },
  ],
};