/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { t } from 'src/qiksar/Translator/Translator';
import IFieldValidation from './IFieldValidation';

export class FieldValidatorBuilder {
  public static BuildValidators(
    fieldType: string,
    definition: IFieldValidation
  ): any[] {
    fieldType = fieldType.toLowerCase().trim();

    const validators = [];

    if (definition.required)
      validators.push((v: any) => !!v || t('A value is required'));

    if (definition.minLength != undefined)
      validators.push((v: any) => {
        return (
          (v as string).length >= definition.minLength ||
          t(
            'Minimum number of characters is' +
              `: ${definition.minLength as number}`
          )
        );
      });

    if (definition.maxLength != undefined)
      validators.push((v: any) => {
        return (
          (v as string).length <= definition.maxLength ||
          t(
            'Maximum number of characters is' +
              `: ${definition.maxLength as number}`
          )
        );
      });

    let pattern = definition.pattern;

    switch (fieldType) {
      case 'email':
        pattern =
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    }

    if (pattern != undefined) {
      validators.push((v: any) => {
        return pattern?.test(v) || t('Input does not match required pattern');
      });
    }

    return validators;
  }
}
