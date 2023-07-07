import {  ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

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


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql',
    headers: {
      Authorization: token,
    },
  }),

});






export default client

