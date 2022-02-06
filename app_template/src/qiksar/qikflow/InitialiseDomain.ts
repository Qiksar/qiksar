/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RouteRecordRaw } from 'vue-router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

import Query from 'src/qiksar/qikflow/base/Query';
import EntitySchema from 'src/qiksar/qikflow/base/EntitySchema';
import ISchemaDefinition from 'src/qiksar/qikflow/base/ISchemaDefinition';
import BuildEntityRoutes from 'src/qiksar/qikflow/router/BuildEntityRoutes';

/**
 * Initialise the data domain with views defined in the specifified folder, denoted by the path parameter.
 * This method is essential, as it resolves circular references between views. For example members => group  and group=>leader, where leader is a member.
 * The method initialises the Apollo client, and provides type policies used the caching.
 *
 *
 * @param schema schema definition
 * @param apolloClient Apollo client for GraphQL
 *
 * @returns Array of routes for dynamically created UI
 */
export default function InitialiseDomain(
  schema: ISchemaDefinition,
  apolloClient: ApolloClient<NormalizedCacheObject>
): RouteRecordRaw[] {
  // Process all of the enumeration types
  schema.enums.map((e) => {
    Query.CreateQuery(EntitySchema.CreateEnum(e), true);
  });

  // Process all of the more complex entities
  schema.entities.map((e) => {
    Query.CreateQuery(EntitySchema.Create(e), true);
  });

  // Connect schema that reference each other, e.g. members->groups   groups->leaders
  EntitySchema.ResolveReferences();

  // create the apollo client, which creates TypePolicies according to the views registered above
  Query.Apollo = apolloClient;

  const dynamicRoutes = BuildEntityRoutes();

  return dynamicRoutes;
}
