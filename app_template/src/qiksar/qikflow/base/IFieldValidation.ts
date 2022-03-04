/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Wrap validation rules for a field
 */
export default interface IFieldValidation {
  required?: boolean;

  min?: any;
  max?: any;

  minLength?: any;
  maxLength?: any;

  oneOf?: any[];
  pattern?: RegExp;

  quasar_validation_rules?: any[];
}
