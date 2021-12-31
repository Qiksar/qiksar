export default async function InitialiseDomain(path:string): Promise<void>{
	
	// TODO CN: 
	// Can we make views auto-discoverable so we don't have to remember to add them to this array?
	const views = ['RolesView', 'StatusView', 'GroupsView', 'MembersView'];
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const imports: Promise<unknown>[] = [];
	
	views.map((v) => {
		imports.push(import(path + v + '.ts'));
		//console.log('Added: ' + v);
	});

	await Promise.all(imports);
}