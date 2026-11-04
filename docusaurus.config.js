module.exports={
  "title": "Nanopublications",
  "tagline": "Small, signed, citable units of knowledge, published on a decentralized network",
  "url": "https://nanopub.net/",
  "baseUrl": "/",
  "organizationName": "Nanopublication",
  "projectName": "nanopub-website",
  // trailingSlash: false,
  "favicon": "img/icon.png",
  "customFields": {
    "repoUrl": "https://github.com/Nanopublication/nanopub-website",
    "markdownPlugins": [
      null,
      null,
      null
    ],
    "gaGtag": false
  },
  "markdown": {
    "hooks": {
      "onBrokenMarkdownLinks": "log"
    }
  },
  "onBrokenLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateTime": true,
          "path": "./docs",
          "breadcrumbs": false,
          "sidebarPath": require.resolve('./sidebars.json')
        },
        "theme": {
          "customCss": "./src/css/customTheme.css"
        }
      }
    ]
  ],

  "plugins": [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        language: ["en"],
      },
    ],
    require.resolve('docusaurus-plugin-image-zoom'),
    // [
    //   "docusaurus2-dotenv",
    //   {
    //     systemvars: true,
    //   },
    // ],
  ],
  "themeConfig": {
    docs: {
      sidebar: {
        hideable: true,
      }
    },
    //announcementBar: {
    //  id: 'support_us',
    //  content:
    //    '🔨 <b>Maintenance</b> will be performed on the DSRI <b>from the 22 to the 30 of October</b>, please make sure your data is backed up outside the DSRI before this date 🔨',
    //  backgroundColor: '#fdd835',
      // textColor: '#091E42',
      // isCloseable: false,
    //},
    prism: {
      additionalLanguages: ['turtle'],
    },
    "navbar": {
      "hideOnScroll": false,
      "title": "Nanopublications",
      "logo": {
        "src": "img/icon.png"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Documentation",
          "position": "left"
        },
        {
          "to": "/sessions",
          "label": "Nano Sessions",
          "position": "left"
        },
        {
          "to": "docs/tutorials/",
          "label": "Tutorials",
          "position": "left"
        },
        {
          "to": "/contact",
          "label": "Contact",
          "position": "left"
        },
        {
          "href": "https://github.com/Nanopublication",
          "position": "right",
          "className": 'header-github-link',
          "aria-label": "GitHub"
        }
      ]
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quick start', to: '/docs/' },
            { label: 'Guidelines', to: '/docs/guidelines' },
            { label: 'Examples', to: '/docs/examples' },
            { label: 'Tools', to: '/docs/tools' },
            { label: 'Tutorials', to: '/docs/tutorials/' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Nano Sessions', to: '/sessions' },
            { label: 'Matrix', href: 'https://matrix.to/#/#nanopub:matrix.org' },
            { label: 'Mailing list', href: 'https://groups.google.com/g/nanopub-users/' },
            { label: 'Mastodon', href: 'https://mas.to/@nanopub' },
          ],
        },
        {
          title: 'Code',
          items: [
            { label: 'Nanopublication on GitHub', href: 'https://github.com/Nanopublication' },
            { label: 'Knowledge Pixels on GitHub', href: 'https://github.com/knowledgepixels' },
            { label: 'Source of this website', href: 'https://github.com/Nanopublication/nanopub-website' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Nanopublication Association · <a href="/contact">Contact</a>`,
    },
    "image": "img/social-card.png",
    zoom: {
      selector: '.markdown > img',
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        }
      }
    },
    // "gtag": {
    //   "trackingID": "UA-172146359-1"
    // }
  }
}
