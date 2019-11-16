import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'http://localhost:4000',
  // Use this URL for production.
  //'https://j3k2p62id1.execute-api.ap-southeast-2.amazonaws.com/dev/',
});