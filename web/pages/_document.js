import { Html, Head, Main, NextScript } from 'next/document'

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/BrandonGrotesque-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DomaineTextWeb-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DomaineTextWeb-RegularItalic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
