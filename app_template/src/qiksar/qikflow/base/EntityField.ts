import { FieldValidatorBuilder } from './FieldValidatorBuilder';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { defaultFieldOptions } from 'src/qiksar/qikflow/base/fieldOptions';
import { t } from 'src/qiksar/Translator/Translator';

import fieldOptions from './fieldOptions';
import fieldType from './fieldType';
import IFieldDefinition from './IFieldDefinition';

export default class EntityField {
  validationRules: any[];

  constructor(private readonly definition: IFieldDefinition) {
    if ('arr obj'.includes(this.Type) && !this.ObjectSchema)
      throw `Invalid field definition ${this.Name} - ${this.Type} must specify a schema`;

    this.validationRules = FieldValidatorBuilder.BuildValidators(
      this.Type,
      definition.validationRules || {}
    );
  }

  get Name(): string {
    return this.definition.column;
  }
  get Label(): string {
    return t(this.definition.label);
  }
  get Type(): fieldType {
    return this.definition.type ?? 'text';
  }
  get Options(): fieldOptions[] {
    return this.definition.options ?? defaultFieldOptions;
  }
  get IsOnGrid(): boolean {
    return this.Options.includes('ongrid');
  }
  get IsReadonly(): boolean {
    return this.Options.includes('readonly');
  }
  get IsRequired(): boolean {
    return this.Options.includes('required');
  }
  get IsSortable(): boolean {
    return this.Options.includes('sortable');
  }
  get IsEnum(): boolean {
    return this.Options.includes('isenum');
  }
  get IsHeavy(): boolean {
    return this.Options.includes('heavy');
  }
  get IsLocale(): boolean {
    return this.Options.includes('locale');
  }
  get IsKey(): boolean {
    return this.definition.type === 'id';
  }
  get IsRelation(): boolean {
    return this.Type === 'arr' || this.Type === 'obj';
  }
  get IsAlias(): boolean {
    return this.Type === 'alias';
  }
  get IsWriteOnce(): boolean {
    return this.Options.includes('writeonce');
  }
  get ObjectName(): string | undefined {
    return this.definition.object_name;
  }
  get KeyColumnName(): string | undefined {
    return this.definition.key_column_name;
  }
  get ObjectColumns(): string | undefined {
    return this.definition.object_columns;
  }
  get ObjectSchema(): string | undefined {
    return this.definition.object_schema;
  }
  get Editor(): string {
    return this.definition.editor ?? 'EntityEditText';
  }
  get Autofocus(): boolean {
    return (this.definition.autofocus as boolean) ?? false;
  }
  get Clearable(): boolean {
    return (this.definition.clearable as boolean) ?? true;
  }
  get Help(): string {
    return t((this.definition.helpText as string) ?? '');
  }
  get Placeholder(): string {
    return t((this.definition.placeholder as string) ?? '');
  }

  get ValidationRules(): any[] {
    return this.validationRules;
  }

  // returns the actual field which is updated if the value of this field is altered
  // e.g. when a selector is used, it is the role_id value on the object which is changed
  // so for a field of 'role' the 'role_id' is the attributed changed in the database
  get AffectedFieldName(): string {
    let fieldName = this.Name;

    if (this.Editor === 'EntityEditSelect') {
      // or being edit by selector
      if (this.KeyColumnName && this.ObjectName) fieldName = this.KeyColumnName;
      else
        throw `Field definition for ${
          this.ObjectSchema ?? '<invalid object schema>'
        }.${this.Name} has missing KeyColumnName and/or ObjectName`;
    }

    return fieldName;
  }
}
