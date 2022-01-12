import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getClient } from '../lib/sanity.server'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return getClient()
      .fetch('*[_id == "global-config"] {lang}.lang[0]')
      .then((lang) => ({ ...initialProps, lang }))
  }

  render() {
    return (
      <Html lang={this.props.lang || 'en'}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
