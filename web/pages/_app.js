import React from 'react'
import GlobalHeader from '../components/GlobalHeader'

import '../styles/app.css'
// import Grid from '../src/components/Grid'

function MyApp({ Component, pageProps }) {
  // const { asPath } = router

  return (
    <>
      <section className="font-sans bg-caramel-100">
        <GlobalHeader />
        <Component {...pageProps} />
      </section>
      <footer className="font-serif italic text-caramel-500 hover:text-caramel-700 transition-colors duration-100 text-center text-sm py-12">
        <a
          href="https://simeongriggs.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          A simeonGriggs Side Project
        </a>
      </footer>
      {/* {process.env.NODE_ENV !== 'production' && <Grid />} */}
    </>
  )
}

export default MyApp
