import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="./favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="./manifest.json" />
        <title>Bitcoin Search</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://bitcoinsearch.xyz/btc_book_2_1.jpg?v1"/>
        <meta name="twitter:title" content="Technical ₿itcoin Search"/>
        <meta name="twitter:description" content="The bitcoin technical search we deserve"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
