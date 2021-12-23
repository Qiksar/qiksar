export default async function InitialiseDomain(views:string[], path:string): Promise<void>{
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const imports: Promise<unknown>[] = [];
	
	views.map((v) => {
		imports.push(import(path + v + '.ts'));
		//console.log('Added: ' + v);
	});

	await Promise.all(imports);
}