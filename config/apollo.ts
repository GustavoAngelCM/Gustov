import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();

const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  credentials: 'same-origin',
  uri: 'http://localhost:4000',

  // Provide some optional constructor fields
  name: 'gustov-restaurant',
  connectToDevTools: true
  // version: '1.3',
  // queryDeduplication: false,
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
});

export {
  client
}