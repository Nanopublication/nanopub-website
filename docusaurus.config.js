module.exports={
  "title": "Nanopublications",
  "tagline": "FAIR data containers for scientific results, and more",
  "url": "https://nanopub.net/",
  "baseUrl": "/",
  "organizationName": "Nanopublication",
  "projectName": "nanopub-website",
  // trailingSlash: false,
  "stylesheets": [
    "https://fonts.googleapis.com/css?family=Roboto:200,300,400,400i,500,600,700",
  ],
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
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
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
    // "prism": {
    //   "additionalLanguages": ['powershell','dockerfile'],
    // },
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
          "href": "https://github.com/Nanopublication/nanopub-website",
          // "label": "GitHub",
          "position": "right",
          "className": 'header-github-link'
        }
      ]
    },
    "image": "img/undraw_online.svg",
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
