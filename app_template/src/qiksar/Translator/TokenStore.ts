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
   * Store a token value which can be used in interpolated strings, e.g. 'Please call our headoffice on, {{ customer.headoffice.phone }} today'.
   * The token path will have any '{{' or '}}' patterns removed, will be trimmed of leading and trailing spaces, and converted to upper case.
   *
   * @param path Path to the token, e.g. customer.headoffice.phone
   * @param value Value to be assigned
   */
  AddToken(path: string, value: string): void {
    path = path.trim().toUpperCase().replace('{{', '').replace('}}', '');

    const datapath: string[] =
      typeof path === 'string' ? path.split('.') : path;
    const lastField = datapath.splice(datapath.length - 1, 1)[0];

    let object = this.tokens;
    datapath.map((p) => {
      object[p] = {};
      object = object[p] as GqlRecord;
    });

    object[lastField] = value;
  }

  /**
   * Expand all tokens in an input string
   * @param inputText
   * @returns Expanded text, and expands nested tokens
   */
  Expand(inputText: string): string {
    let returnText = this.ReplaceTokens(inputText);
    let previousText = '';

    while (
      returnText &&
      returnText !== previousText &&
      previousText.indexOf('{{') != -1
    ) {
      previousText = returnText;
      returnText = this.ReplaceTokens(inputText);
    }

    return returnText;
  }

  /**
   * Replace the first token in appearing in the input text
   *
   * @param inputText
   * @returns
   */
  private ReplaceTokens(inputText: string): string {
    const start = inputText.indexOf('{{');

    if (start == -1) return inputText;

    const end = inputText.indexOf('}}', start);

    if (end == -1) return inputText;

    const tokenPath = inputText
      .substring(start + 2, end)
      .trim()
      .toUpperCase();
    const tokenValue = this.GetTokenValue(tokenPath);
    const returnText =
      inputText.substring(0, start) + tokenValue + inputText.substring(end + 2);

    //console.log('tokenPath: ' + tokenPath)
    //console.log('tokenValue: ' + tokenValue)
    //console.log('returnText: ' + returnText)

    return returnText;
  }

  /**
   * Get the value of a token, including a range of pre-defined token, such as date and time types
   *
   * @param tokenPath
   * @returns
   */
  private GetTokenValue(tokenPath: string): string {
    switch (tokenPath.toUpperCase().trim()) {
      case 'FULL-DATE':
        return new Date().toDateString();

      case 'DATE':
        return new Date().toLocaleDateString();

      case 'DATE-TIME':
        const d = new Date();
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

      case 'TIME':
        return new Date().toLocaleTimeString();

      default:
        return JsonTools.ExtractFromPath(this.tokens, tokenPath);
    }
  }
}
