import { GqlRecord } from '../qikflow/base/GqlTypes';
import JsonTools from '../qikflow/base/JsonTools';

/**
 * Provide a means to expand tokens in interpolated strings, where {{ token_values }} are fully expanded, even if nested values are used
 */
export default class TokenStore {
    private tokens: GqlRecord = {};
  
    /**
     * Get the value of a token
     * 
     * @param tokenPath Path to the required value, e.g. customer.headoffice.phone
     * @returns Value converted to the required type
     */
    GetToken<Type>(tokenPath: string): Type {
        return JsonTools.ExtractFromPath<Type>(this.tokens, tokenPath);
    }   

    /**
     * Store a token value which can be used in interpolated strings, e.g. 'Please call our headoffice on, {{ customer.headoffice.phone }} today'
     * 
     * @param path Path to the token, e.g. customer.headoffice.phone
     * @param value Value to be assigned
     */
    AddToken(path: string, value: string): void {
        const datapath:string[] = typeof path === 'string' ? path.split('.') : path;
        const lastField = datapath.splice(datapath.length - 1, 1)[0];

		let object = this.tokens;
		datapath.map((p) => {
            object[p] = { };
            object = object[p] as GqlRecord;
        });

        object[lastField] = value;
    }

    Expand(inputText:string): string{
        return inputText;
    }
}
