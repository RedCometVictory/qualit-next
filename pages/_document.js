import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body>
        {/* <ThemeScriptTag
          defaultDarkTheme="theme-dark" 
          defaultLightTheme="theme-light"
          themeStorageKey='blog__theme'
        /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}