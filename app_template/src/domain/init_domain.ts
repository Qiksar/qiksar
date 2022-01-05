// TODO : This file should be generated

export default async function InitialiseDomain(path:string): Promise<void>{
	await import(path + 'TenantsView' + '.ts');
	await import(path + 'RolesView' + '.ts');
	await import(path + 'StatusView' + '.ts');
	await import(path + 'GroupsView' + '.ts');
	await import(path + 'MembersView' + '.ts');
}
