import { FieldValidatorBuilder } from './FieldValidatorBuilder';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { defaultFieldOptions } from 'src/qiksar/qikflow/base/fieldOptions';
import { t } from 'src/qiksar/Translator/Translator';

import fieldOptions from './fieldOptions';
import fieldType from './fieldType';
import IFieldDefinition from './IFieldDefinition';
import IJoinUsage from './IJoinUsage';

export default class EntityField {
  _is_join = false;
  validationRules: any[] = [];

  constructor(private readonly definition: IFieldDefinition | IJoinUsage) {
    // If the definition relates to the usage of a many to many join...
    if ((this.definition as IJoinUsage)['join_table']) {
      this._is_join = true;
      return;
    }

    // Otherwise process a normal field definition
    if ('arr obj'.includes(this.Type) && !this.ObjectSchema)
      throw `Invalid field definition ${this.Name} - ${this.Type} must specify a schema`;

    this.validationRules = FieldValidatorBuilder.BuildValidators(
      this.Type,
      this.FieldDefinition.validationRules || {}
    );
  }

  get FieldDefinition(): IFieldDefinition {
    return this.definition as IFieldDefinition;
  }

  get IsJoin(): boolean {
    return this._is_join;
  }

  get JoinName(): string {
    return (this.definition as IJoinUsage).join_table;
  }

  get Name(): string {
    return this.FieldDefinition.column;
  }
  get Label(): string {
    return t(this.FieldDefinition.label);
  }
  get Type(): fieldType {
    return this.FieldDefinition.type ?? 'text';
  }
  get Options(): fieldOptions[] {
    return this.FieldDefinition.options ?? defaultFieldOptions;
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
    return this.FieldDefinition.type === 'id';
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
    return this.FieldDefinition.object_name;
  }
  get KeyColumnName(): string | undefined {
    return this.FieldDefinition.key_column_name;
  }
  get ObjectColumns(): string | undefined {
    return this.FieldDefinition.object_columns;
  }
  get ObjectSchema(): string | undefined {
    return this.FieldDefinition.object_schema;
  }
  get Editor(): string {
    return this.FieldDefinition.editor ?? 'EntityEditText';
  }
  get Autofocus(): boolean {
    return (this.FieldDefinition.autofocus as boolean) ?? false;
  }
  get Clearable(): boolean {
    return (this.FieldDefinition.clearable as boolean) ?? true;
  }
  get Help(): string {
    return t((this.FieldDefinition.helpText as string) ?? '');
  }
  get Placeholder(): string {
    return t((this.FieldDefinition['placeholder'] as string) ?? '');
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
