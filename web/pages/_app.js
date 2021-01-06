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
      {/* {process.env.NODE_ENV !== 'production' && <Grid />} */}
    </>
  )
}

export default MyApp
