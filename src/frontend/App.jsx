import { hot } from 'react-hot-loader/root';
import React from 'react';
import './styles/index.scss';
import MainRoutes from './routes';
import { ApolloClient } from 'apollo-client';

import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';

const host = window ? (window.location.host).split(':')[0] : 'localhost';

const httpLink = new HttpLink({
  uri: `http://${host}:4000/`
});

const wsLink = new WebSocketLink({
  uri: `ws://${host}:4000/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
	const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

class App extends React.PureComponent {
	render() {
		return (
			<ApolloProvider client={client}>
			<div>
				<MainRoutes />
			</div>
			</ApolloProvider>
		);
	}
}

export default hot(App);