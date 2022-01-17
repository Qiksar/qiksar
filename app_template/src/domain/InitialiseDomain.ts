/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { AuthWrapper } from 'src/boot/qiksar';
import Query from 'src/qiksar/qikflow/base/Query';
import EntitySchema from 'src/qiksar/qikflow/base/EntitySchema';
import CreateApolloClient from 'src/qiksar/apollo/CreateApolloClient';

/**
 * Initialise the data domain with views defined in the specifified folder, denoted by the path parameter.
 * This method is essential, as it resolves circular references between views. For example members => group  and group=>leader, where leader is a member.
 * Finaly the method initialises the Apollo client, and provides type policies used the caching.
 *
 * @param path subfolder in which the views are defined
 * @param views array of view names to be imported
 */
export default async function InitialiseDomain(views: string[]): Promise<void> {
  // Load the views in the sequence that they are declared in and await each to completely load before going to the next
  for (const viewName of views) {
    await import('./views/' + viewName + '.ts');
  }

  // Connect schema that reference each other, e.g. members->groups   groups->leaders
  EntitySchema.ResolveReferences();

  // create the apollo client, which creates TypePolicies according to the views registered above
  Query.Apollo = CreateApolloClient(AuthWrapper);
}
