import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { client } from '../config/apollo'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Gustov</title>
        <meta name="description" content="Restaurant Gustov" />
        <link rel="icon" href="/gustov.ico" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
