import '../styles/globals.css'
import Head from 'next/head'
import { LocaleProvider } from '../contexts/LocaleContext'
import App from 'next/app'

function MyApp({ Component, pageProps }) {
  const initialLocale = pageProps && pageProps.initialLocale
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </Head>
      <div suppressHydrationWarning>
        <Component {...pageProps} />
      </div>
    </LocaleProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const req = appContext.ctx.req
  let initialLocale = undefined
  if (req && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim())
    for (const c of cookies){
      const [k,v] = c.split('=')
      if (k === 'locale') { initialLocale = decodeURIComponent(v); break }
    }
  }
  return { ...appProps, pageProps: { ...appProps.pageProps, initialLocale } }
}

export default MyApp
