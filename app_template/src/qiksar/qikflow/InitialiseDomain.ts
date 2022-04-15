/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RouteRecordRaw } from 'vue-router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

import Query from 'src/qiksar/qikflow/base/Query';
import IDomainDefinition from 'src/qiksar/qikflow/base/IDomainDefinition';
import BuildEntityRoutes from 'src/qiksar/qikflow/router/BuildEntityRoutes';
import EntityDefinition from 'src/qiksar/qikflow/base/EntityDefinition';

/**
 * Initialise the data domain with views defined in the specifified folder, denoted by the path parameter.
 * This method is essential, as it resolves circular references between views. For example members => group  and group=>leader, where leader is a member.
 * The method initialises the Apollo client, and provides type policies used the caching.
 *
 *
 * @param domain schema definition
 * @param apolloClient Apollo client for GraphQL
 *
 * @returns Array of routes for dynamically created UI
 */
export default function InitialiseDomain(
  domain: IDomainDefinition,
  apolloClient: ApolloClient<NormalizedCacheObject>
): RouteRecordRaw[] {
  // Process all of the enumeration types
  domain.enums.map((e) => {
    Query.CreateQuery(EntityDefinition.CreateEnum(e), true);
  });

  // Process all of the more complex entities
  domain.entities.map((entityDefinition) => {
    Query.CreateQuery(EntityDefinition.Create(entityDefinition, false), true);

    if (entityDefinition.joins) {
      entityDefinition.joins.map((name) => {
        // If the join entity has not already been created
        const schema = EntityDefinition.GetSchemaForEntity(name);

        if (schema === null) {
          const join = domain.GetJoin(name);

          if (!join) {
            throw `Error: Domain does not have a  definition named: '${name}'`;
          }

          Query.RegisterJoinDefnition(join);

          const entityFieldDefinition = {
            name: join.source,
            label: join.source,
            icon: 'none',
            key: 'row_id',
            fields: [
              {
                name: join.master_entity,
                label: join.master_entity,
                column: join.master_key,
              },
              {
                name: join.secondary_entity,
                label: join.secondary_entity,
                column: join.secondary_key,
              },
            ],
          };

          const joinEntity = EntityDefinition.Create(
            entityFieldDefinition,
            true
          );
          Query.CreateQuery(joinEntity, false);
        }
      });
    }
  });

  // Connect schema that reference each other, e.g. members->groups   groups->leaders
  EntityDefinition.ResolveReferences();

  // create the apollo client, which creates TypePolicies according to the views registered above
  Query.Apollo = apolloClient;

  const dynamicRoutes = BuildEntityRoutes();

  return dynamicRoutes;
}
