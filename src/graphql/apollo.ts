import ApolloClient, { InMemoryCache } from 'apollo-boost';

const cache = new InMemoryCache();

export const client = new ApolloClient({
  // ENTER YOUR GRAPHQL ENDPOINT BELOW
  uri: '',
  cache: cache,
  request: (operation) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('AUTH_TOKEN'),
  },
});