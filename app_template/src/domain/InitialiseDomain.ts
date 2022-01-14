/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateApolloClient } from 'src/apollo';
import Query from 'src/qiksar/qikflow/base/Query';
import EntitySchema from 'src/qiksar/qikflow/base/EntitySchema';

/**
 * Initialise the data domain with views defined in the specifified folder, denoted by the path parameter.
 * This method is essential, as it resolves circular references between views. For example members => group  and group=>leader, where leader is a member.
 * Finaly the method initialises the Apollo client, and provides type policies used the caching.
 * 
 * @param path subfolder in which the views are defined
 * @param views array of view names to be imported
 */
export default async function InitialiseDomain(views: string[]): Promise<void> {
	
	const imports = [] as unknown[];
	views.map((m:string) => {
		imports.push(import('./views/' + m + '.ts')); 
		});
	await Promise.all(imports);

	// Connect schema that reference each other, e.g. members->groups   groups->leaders
	EntitySchema.ResolveReferences();
	
	// create the apollo client, which creates TypePolicies according to the views registered above
	Query.Apollo = CreateApolloClient();	
}
