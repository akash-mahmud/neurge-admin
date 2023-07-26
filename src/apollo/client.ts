import store from '@/store';
import {  ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

import fetch from 'cross-fetch';




const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


/**
 * @param httpLink  from @apollo/client should be replace with
 * @param createUploadLink from apollo-upload-client in every place where we are using httpLink
 */


const uploadAbleHttpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL,

  fetch,

});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(uploadAbleHttpLink)

});






export default client

