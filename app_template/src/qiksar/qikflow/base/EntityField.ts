import { t } from 'src/qiksar/Translator/Translator';

import fieldOptions from './fieldOptions';
import fieldType from './fieldType';
import IFieldDefinition from './IFieldDefinition';

export const defaultFieldOptions: fieldOptions[] = ['ontable', 'sortable'];
export const defaultIntFieldOptions: fieldOptions[] = [...defaultFieldOptions, 'locale'];
export const defaultEnumOptions: fieldOptions[] = ['ontable', 'sortable', 'readonly', 'EntityEditText'];
export const hiddenFieldOptions: fieldOptions[] = ['hidden'];

export default class EntityField {

//#region Properties    
    private _name: string;
    private _type: fieldType;
    private _key_column_name: string | undefined = undefined;
    private _object_name: string | undefined = undefined;
    private _object_columns: string | undefined = undefined;
    private _object_schema: string | undefined = undefined;
    private _label: string;
    private _sortable: boolean;
    private _on_table: boolean;
    private _readonly: boolean;
    private _required: boolean;
    private _is_enum: boolean;
    private _heavy: boolean;
    private _locale: boolean;
    private _options: fieldOptions[];
    private _editor: string;
//#endregion

    constructor(def: IFieldDefinition) {

        this._name = def.name;
        this._label = def.label;
        this._type = def.type;
        this._options = def.options ?? defaultFieldOptions;

        this._key_column_name = def.key_column_name;
        this._object_name = def.object_name;
        this._object_columns = def.object_columns;
        this._object_schema = def.object_schema;

        if ('arr obj'.includes(this.Type) && !this._object_schema)
            throw `Invalid field definition ${this.Name} - ${this.Type} must specify a schema`

        this._sortable = this.Options.includes('sortable');
        this._on_table = this.Options.includes('ontable');
        this._readonly = this.Options.includes('readonly');
        this._required = this.Options.includes('required');
        this._is_enum = this.Options.includes('isenum');
        this._heavy = this.Options.includes('heavy');
        this._locale = this.Options.includes('locale');

        const editor = this._options.filter(o => o.startsWith('EntityEdit'));
        this._editor = editor.length > 0 ? editor[0] : 'EntityEditText';
    }

    get Editor(): string { return this._editor ?? '' }
    get Name(): string { return this._name }
    get Label(): string { return t(this._label) }
    get Type(): fieldType { return this._type }
    get Options(): fieldOptions[] { return this._options }

    get IsOnTable(): boolean { return this._on_table }
    get IsReadonly(): boolean { return this._readonly }
    get IsRequired(): boolean { return this._required }
    get IsSortable(): boolean { return this._sortable }
    get IsEnum(): boolean { return this._is_enum }
    get IsHeavy(): boolean { return this._heavy }
    get IsLocale(): boolean { return this._locale }
    get IsKey(): boolean { return this._type === 'id' }
    get IsRelation(): boolean { return this._type === 'arr' || this._type === 'obj' }
    get IsAlias(): boolean { return this._type === 'alias' }

    get ObjectName(): string | undefined { return this._object_name }
    get KeyColumnName(): string | undefined { return this._key_column_name }
    get ObjectColumns(): string | undefined { return this._object_columns }
    get ObjectSchema(): string | undefined { return this._object_schema }

    // returns the actual field which is updated if the value of this field is altered
    // e.g. when a selector is used, it is the role_id value on the object which is changed
    // so for a field of 'role' the 'role_id' is the attributed changed in the database
    get AffectedFieldName(): string {
        let fieldName = this.Name;

        if (this.Editor === 'EntityEditSelect') { // or being edit by selector
            if (this.KeyColumnName && this.ObjectName)
                fieldName = this.KeyColumnName;
            else
                throw `Field definition for ${this.ObjectSchema ?? '<invalid object schema>'}.${this.Name} has missingKeyColumnName and/or ObjectName`;
        }

        return fieldName;
    }
}
