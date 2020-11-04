import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import typeDefs from './type-defs';

const server = new ApolloServer({
    resolvers,
    typeDefs,
 });

server.listen()
  .then(({ url , subscriptionsUrl }) => {
    console.log(`Server ready at ${url}. Subscriptions at ${subscriptionsUrl}`);
  });