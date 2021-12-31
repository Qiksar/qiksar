export default async function InitialiseDomain(path:string): Promise<void>{
	
	const views = ['RolesView', 'StatusView', 'GroupsView', 'MembersView'];
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const imports: Promise<unknown>[] = [];
	
	views.map((v) => {
		imports.push(import(path + v + '.ts'));
		//console.log('Added: ' + v);
	});

	await Promise.all(imports);
}