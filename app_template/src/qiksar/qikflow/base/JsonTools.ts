/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { GqlRecord } from './GqlTypes';

export default class JsonTools {

	/** 
	 * Given a source GqlRecord compliant type, extract an element from the object graph
	 * which is specified as the path parameter.
	 * 
	 * @param data	 The source GraphQL Record from which an element is to be extracted
	
	* @param path	 A string specifying the path to the required element e.g. 'result.data.members[0]', or an array, e.g. ['result', 'data', 'customer', 'name']
	 
	* @returns {Type} The extracted element as the specified generic type parameter
	 * 
	 * @example
	 * const fname = ExtractFromPath<string>(CustomerRecord, 'result.data.customer[0].first_name') 
	 * const lname = ExtractFromPath<string>(CustomerRecord, ['result', 'data', 'customer', 'last_name']) 
	 * @example
	 */ 
	
	static ExtractFromPath<Type>(data: GqlRecord, path: string | any[]): Type {
		const datapath:any[] = typeof path === 'string' ? path.split('.') : path;

		let field = data;
		datapath.map((p) => (field = field[p] as GqlRecord));

		return field as Type;
	}
}