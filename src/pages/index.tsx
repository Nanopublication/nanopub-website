import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import MDXContent from '@theme/MDXContent';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

import IntroductionMarkdown from './introduction.md';


function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Nanopublications are small RDF graphs with provenance, identified by content hashes, signed by their creators, and published on a decentralized network.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/">
              Get started
            </Link>
            <Link className="button button--outline button--secondary button--lg" to="/docs/examples">
              Examples
            </Link>
          </div>
        </div>
      </header>
      <main className={clsx('container', styles.intro)}>
        <div className="markdown">
          <MDXContent>
            <IntroductionMarkdown />
          </MDXContent>
        </div>
      </main>
    </Layout>
  );
}
export default Home;
