import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

import IntroductionMarkdown from './introduction.md';


function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // const [state, setState] = React.useState({ });
  // const stateRef = React.useRef(state);
  // // Avoid conflict when async calls
  // const updateState = React.useCallback((update) => {
  //   stateRef.current = {...stateRef.current, ...update};
  //   setState(stateRef.current);
  // }, [setState]);

  // React.useEffect(() => {
  // }, [])

  return (
    <Layout title={`${siteConfig.title}`} description="Nanopublications">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>

        {/* introduction.md */}
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <IntroductionMarkdown />
            </div>
          </div>
        </section>

        {/* Get started button */}
        <section className={styles.features}>
          <div className="container">
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  'button button--outline button--primary button--lg',
                  styles.getStarted,
                )}
                to={useBaseUrl('docs/')}>
                Get Started
              </Link>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
export default Home;
