import {  ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'cross-fetch';

let token =''
if (typeof window !== 'undefined')  {
  let authState 
  
  try {
    authState = localStorage.getItem('persist:root')? JSON.parse(JSON.parse(localStorage.getItem('persist:root') as string)?.auth):''
  } catch (error) {
    
  }
  
  if(authState?.isAuthenticated){
    token = 'Bearer'+' '+authState?.token

  }

};

/**
 * @param httpLink  from @apollo/client should be replace with
 * @param createUploadLink from apollo-upload-client in every place where we are using httpLink
 */


const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    Authorization: token,
    'Apollo-Require-Preflight': 'true'

  },
  fetch,

});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uploadLink

});






export default client

