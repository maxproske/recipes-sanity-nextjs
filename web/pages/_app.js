import React from 'react'
import { DefaultSeo } from 'next-seo'
import GlobalHeader from '../components/GlobalHeader'

import '../styles/app.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Half The Sugar, Twice The Ginger"
        defaultTitle="Half The Sugar, Twice The Ginger"
        description="A family cookbook by Proske, Swanson & Mahato"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://recipes.mproske.com',
          siteName: 'Half The Sugar, Twice The Ginger',
          images: [
            {
              url: 'https://recipes.mproske.com/img/logo-bg.png',
              alt: 'Half The Sugar, Twice The Ginger',
            },
          ],
        }}
      />
      <section className="font-sans bg-caramel-100">
        <GlobalHeader />
        <Component {...pageProps} />
      </section>
      <footer className="font-serif italic text-caramel-500 hover:text-caramel-700 transition-colors duration-100 text-center text-sm py-12" />
    </>
  )
}

export default MyApp
