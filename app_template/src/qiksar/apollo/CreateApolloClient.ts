import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
  NormalizedCacheObject,
} from '@apollo/client/core';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { AuthWrapper } from 'src/boot/qiksar';
import Query from 'src/qiksar/qikflow/base/Query';
import QiksarAuthWrapper from 'src/qiksar/auth/QiksarAuthWrapper';

/**
 * Create the apollo client and use the auth wrapper to acquire a token
 * to secure communication
 * @param auth Auth service which provides the authentication token
 * @returns Apollo client
 */
export default function CreateApolloClient(
  auth: QiksarAuthWrapper
): ApolloClient<NormalizedCacheObject> {
  if (!process.env.PUBLIC_GRAPHQL_ENDPOINT)
    throw 'PUBLIC_GRAPHQL_ENDPOINT is undefined';

  const httpURI = process.env.PUBLIC_GRAPHQL_ENDPOINT;
  const protocol = httpURI.includes('localhost') ? 'ws://' : 'wss://';
  const wsURI = httpURI.replace(/http(s)?:\/\//, protocol);

  const httpLink = new HttpLink({ uri: httpURI });

  const authLink = setContext((_, { headers }) => {
    const authToken = auth.GetAuthToken();

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    };
  });

  let link: ApolloLink = authLink.concat(httpLink);

  const subClient = new SubscriptionClient(wsURI, {
    lazy: true,
    reconnect: true,
    reconnectionAttempts: 3,
    timeout: 30000,
    connectionParams: () => {
      const accessToken = AuthWrapper.GetAuthToken();
      return accessToken ? { bearer: accessToken } : {};
    },
  });

  const wssLink = new WebSocketLink(subClient);

  link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wssLink,
    link
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
