# Nanopublication website

[![Deploy to GitHub Pages](https://github.com/Nanopublication/nanopub-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/Nanopublication/nanopub-website/actions/workflows/deploy.yml)

Code for the website presenting the Nanopublication ecosystem, hosted at [nanopub.net](https://nanopub.net).

The website is automatically updated by a [GitHub Action](/actions) at each push to this repository `main` branch.

## ✍️ Contribute

Contributions are welcome!

### 📝 Edit documentation pages

Editing a documentation file is as easy as going to the markdown file for the page on GitHub: https://github.com/Nanopublication/nanopub-website/blob/main/docs/tools.md

* Edit a page by login with an account that has edit permissions.

* Otherwise fork the repository and modify the files you want. Pull requests are welcome!

If you are making substential changes we recommend you to clone the repository, and work locally (cf. below *Deployment* section to)

> We recommend using [Typora](https://typora.io/) to edit [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) files easily on your computer.

### 📂 Files locations

To edit the website content and configuration:

- Most website pages are markdown files in `src/pages/` and `docs/`
- New pages links can be easily added to the sidebar in `sidebars.json`
- The main parameters of the website can be found in `docusaurus.config.js`
- Static content, such as images, css, js or files to download, can be added in `static/`
- The main theme color can be changed in `src/css/customTheme.css`, we recommend to use [this tool to generate the color palette](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima).

## 🧑‍💻 Deployment

To deploy the website locally and see your changes, go to your computer terminal, and clone the repository:

```bash
git clone https://github.com/Nanopublication/nanopub-website
cd nanopub-website
```

### 🧶 Deploy with yarn

<details><summary>Install <code>nodejs >=18</code>, and <code>yarn</code> if not already done</summary>

* [Instructions to install `npm` and `NodeJS`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Instructions to install `yarn`](https://yarnpkg.com/getting-started/install)
</details>

To deploy the website locally with `yarn` and see your changes:

1. Install the dependencies:

    ```shell
    yarn
    ```

2. Deploy the website on http://localhost:3000, it will reload automatically when you make changes to the code and markdown files:

    ```shell
    yarn dev
    ```

### 🐳 Deploy with docker

Alternatively you can deploy the website locally with docker and docker-compose (make sure they are installed):

```bash
docker-compose up
```

### 🚀 Deploy in production

The website is available at https://nanopub.net, it is automatically updated and published to GitHub Pages by a [GitHub Action](https://github.com/Nanopublication/nanopub-website/blob/main/actions) at each push to the `main` branch of this repository.

## ✒️ Markdown tips

### Add an announcement top bar

You can easily add a general announcement bar on the website if you want to pass some information to your users, like dates of maintenance

Open the file `docusaurus.config.js` and update the `announcementBar` variable.

You can comment the `announcementBar` code block when you want to remove the announcement bar.

### Info boxes

Colored box to highlight informations:

```markdown
:::note
Grey box
:::
:::tip You can specify an optional title
Green box
:::
:::info
Blue box
:::
:::caution
Orange box
:::
:::danger
Red box
:::
```

## 🙏 Acknowledgments

Documentation website built with [Docusaurus](https://docusaurus.io/).