import { GetAuthToken } from './../boot/keycloak';
import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
	split,
	NormalizedCacheObject,
} from '@apollo/client/core';

import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { SubscriptionClient, ConnectionParams } from 'subscriptions-transport-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Query from '../domain/qikflow/base/Query'


// Determinte the websocket URI
if (!process.env.HASURA_METADATA_ENDPOINT) 
  throw 'HASURA_METADATA_ENDPOINT is undefined';    

  const httpURI = process.env.HASURA_METADATA_ENDPOINT;

const protocol = httpURI.includes('localhost') ? 'ws://' : 'wss://';
const wsURI = httpURI.replace(/http(s)?:\/\//, protocol);



function getConnectionParams(): ConnectionParams {
	const accessToken = GetAuthToken();
	return accessToken ? { bearer: accessToken } : {};
}

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	// return the headers to the context so httpLink can read them
	const token = GetAuthToken();

	return {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

function createWebsocketLink(url: string) {
	const subClient = new SubscriptionClient(url, {
		lazy: true,
		reconnect: true,
		reconnectionAttempts: 3,
		timeout: 30000,
		connectionParams: getConnectionParams,
	});

	//subClient.onConnecting(() => { ... });
	//subClient.onConnected(() => { ... });
	//subClient.onReconnecting(() => { ... });
	//subClient.onReconnected(() => { ... });

	// Example usage of state handlers:
	subClient.onDisconnected(() => {
		if (process.env.DEV) console.log('[ApolloClient] Disconnected.');
	});

	return new WebSocketLink(subClient);
}

export function CreateApolloClient(): ApolloClient<NormalizedCacheObject> {
	const httpLink = new HttpLink({ uri: httpURI });
	let link: ApolloLink = authLink.concat(httpLink);

	const wssLink = createWebsocketLink(wsURI);

	link = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		wssLink,
		authLink.concat(httpLink)
	);

	const client = new ApolloClient({
		link,
		cache: new InMemoryCache({ typePolicies: Query.ApolloTypePolicies }),
		connectToDevTools: !!process.env.DEBUGGING,
		defaultOptions: {
			query: {
				fetchPolicy: 'network-only',
			},
			watchQuery: {
				fetchPolicy: 'network-only',
			},
		},
	});

	return client;
}
