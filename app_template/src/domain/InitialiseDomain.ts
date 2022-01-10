// TODO : This file should be generated
import { CreateApolloClient } from 'src/apollo';
import Query from 'src/qiksar/qikflow/base/Query';
import EntitySchema from 'src/qiksar/qikflow/base/EntitySchema';

export default async function InitialiseDomain(): Promise<void>{
	const path ='./views/';

	await import(path + 'TenantsView.ts');
	await import(path + 'RolesView.ts');
	await import(path + 'StatusView.ts');
	await import(path + 'GroupsView.ts');
	await import(path + 'MembersView.ts');

	// Connect schema that reference each other, e.g. members->groups   groups->leaders
	EntitySchema.ResolveReferences();
	
	// create the apollo client, which creates TypePolicies according to the views registered above
	Query.Apollo = CreateApolloClient();	
}
