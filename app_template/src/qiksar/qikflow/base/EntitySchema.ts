import EntityField, {
  defaultFieldOptions,
  hiddenFieldOptions,
  defaultEnumOptions,
  defaultIntFieldOptions,
} from './EntityField';
import fieldOptions from './fieldOptions';
import IFieldDefinition from './IFieldDefinition';
import { TransformRecordFunction, Dictionary, GqlRecord } from './GqlTypes';
import Query, { defaultFetchMode } from './Query';
import fetchMode from './fetchMode';
import IInclude from './IInclude';
import { t } from 'src/qiksar/Translator/Translator';

/**
 * Describes the structure of a GraphQL object, including its fields, field types and relationships to other GraphQL objects.
 */
export default class EntitySchema {
  //#region Properties

  private _description: string;
  private _entityType: string;
  private _fields: Array<EntityField>;
  private _key: string;
  private _is_enum: boolean;
  private _includes: IInclude[];
  private _transformers: Record<string, GqlRecord>;

  //#endregion

  //#region Static members

  /**
   * Internal array of schema
   */
  private static _schemas: Array<EntitySchema> = [];

  /**
   * Global list of registered schemas
   */
  static get Schemas(): Array<EntitySchema> {
    return this._schemas;
  }

  //#endregion

  //#region Transformation

  CreateTransform(name: string, transform: GqlRecord): EntitySchema {
    this._transformers[name] = transform;

    return this;
  }

  GetTransform(name: string): GqlRecord {
    const transform = this._transformers[name];

    if (!transform) throw `Transform '{name}' has not be registered`;

    return transform;
  }

  //#endregion

  //#region Getters / Setters

  /**
   * Default caption applied when the schema is displayed
   */
  get Label(): string {
    return this._description;
  }

  /**
   * Name of the entity
   */
  get EntityName(): string {
    return this._entityType;
  }

  /**
   * List of fields
   */
  get Fields(): EntityField[] {
    return this._fields;
  }

  /**
   * Name of unique key field
   */
  get Key(): string {
    return this._key;
  }

  /**
   * Indicates if the schema is an enumeration
   */
  get IsEnum(): boolean {
    return this._is_enum;
  }

  get LocaleFields(): EntityField[] {
    return this._fields.filter((f) => f.IsLocale);
  }

  //#endregion

  /**
   * Construct new object
   *
   * @param entityName Unique name for the schema
   * @param keyField Name of the field which is the unique database ID
   * @param label Default label
   * @param isEnum Indicates if the table is an enumeration type, which enables it to be quickly used for dropdown selections
   */
  constructor(
    entityName: string,
    keyField: string,
    label: string,
    isEnum = false
  ) {
    this._entityType = entityName.toLowerCase();
    this._key = keyField;
    this._description = label;
    this._fields = new Array<EntityField>();
    this._is_enum = isEnum;
    this._includes = [];
    this._transformers = {};
  }

  /**
   * Resolve references between schema
   */
  static ResolveReferences(): void {
    this._schemas.map((s) => s.ResolveConnections());
  }

  /**
   * Get the schema for a specified entity
   * @param entityName Name of the entity
   * @returns The schema, or null if the schema does not exist
   */
  static GetSchemaForEntity(entityName: string): EntitySchema | null {
    entityName = entityName.toLowerCase();

    const schemas = this._schemas.filter(
      (s: EntitySchema) => s.EntityName === entityName
    );

    return schemas.length > 0 ? schemas[0] : null;
  }

  /**
   * Create a schema
   *
   * @param entityName Name of the entity type
   * @param keyField Name of the field which is the database unique ID
   * @param label Default label
   * @returns Schema
   */
  static Create(
    entityName: string,
    keyField: string,
    label: string | undefined
  ): EntitySchema {
    entityName = entityName.toLowerCase();

    const schema: EntitySchema = new EntitySchema(
      entityName,
      keyField,
      label ?? entityName
    );

    if (this.GetSchemaForEntity(entityName))
      throw `!!!! FATAL ERROR: Schema has already been registered for entity type${schema.EntityName}`;

    this._schemas.push(schema);

    return schema.SetKey(keyField);
  }

  /**
   * Create a schema for an enumeration
   *
   * @param entityName Name of the entity type
   * @param label Default label
   * @returns Schema
   */
  static CreateEnum(
    entityName: string,
    label: string | undefined
  ): EntitySchema {
    const key = 'id';
    entityName = entityName.toLowerCase();

    const schema: EntitySchema = new EntitySchema(
      entityName,
      key,
      label ?? entityName,
      true
    );

    if (this.GetSchemaForEntity(entityName))
      throw `!!!! FATAL ERROR: Schema has already been registered for entity type${schema.EntityName}`;

    this._schemas.push(schema);

    return schema
      .SetKey(key, ['sortable'])
      .Field('name', 'Label')
      .Field('comment', 'Description')
      .CreateTransform('selector', {
        id: 'id',
        label: 'name',
        comment: 'comment',
      });
  }

  /**
   * Get columns, including from nested entities, to support building of a GraphQL query
   *
   * @param fetch_mode Fetch mode enables easy filtering of columns to prevent overfetch
   * @param entityStack Track entities as columns added to the output
   * @returns Text representation of columns to be included in GraphQL query
   */
  Columns(fetch_mode: fetchMode, entityStack: string[]): string {
    let columns = '';
    let fields = this.Fields;

    switch (fetch_mode) {
      case 'grid':
        fields = fields.filter((f) => f.IsKey || f.IsOnTable);
        break;

      case 'light':
        fields = fields.filter((f) => f.IsKey || !f.IsHeavy);
        break;

      case 'heavy':
        // all fields are returned
        break;
    }

    fields.map((f) => (columns += this.FieldToGql(f, entityStack) + ' '));

    return columns;
  }

  /**
   * Return GraphQL fragment representing a field in a query
   *
   * @param field Field definition
   * @param entityStack Track entities being processed to form the GraphQL statement for the field
   * @returns Text representation of the field as a GraphQL fragment
   */
  FieldToGql(field: EntityField, entityStack: string[]): string {
    if ('arr obj alias'.indexOf(field.Type) == -1) return field.Name;

    if (
      (field.Type == 'arr' || field.Type == 'obj') &&
      entityStack.filter((e) => e === field.ObjectName).length == 0
    ) {
      return this.RelatedObjectToGql(field, entityStack);
    }

    return '';
  }

  /**
   * Return GraphQL fragment representing a related GraphQL object
   *
   * @param field Field definition
   * @param entityStack Track entities being processed to form the GraphQL statement for the field
   * @returns Text representation of the field as a GraphQL fragment
   */
  RelatedObjectToGql(field: EntityField, entityStack: string[]): string {
    if (!field.ObjectSchema)
      throw `Schema reference is missing on ${this.EntityName}.${field.Name}`;

    if (!field.ObjectName)
      throw `Fieldname of object must be specified on field ${JSON.stringify(
        field
      )}`;

    let field_definition = null;

    entityStack.push(field.ObjectSchema);

    const refSchema = EntitySchema.GetSchemaForEntity(field.ObjectSchema);

    if (!refSchema)
      throw `!!!! FATAL ERROR: Entity ${this.EntityName} references unknown schema ${field.ObjectName}`;

    // when a referenced object is required the object's key is required in addition to the object
    // and it's nominated fields. e.g. role_id role {name comment}
    // role_id can then be edited in the UI and updated
    const related_object_key = field.KeyColumnName ?? '';
    // fetch only the nominated columns, or if none are nominated, fetch all
    if (field.ObjectColumns)
      field_definition = `${related_object_key} ${field.ObjectName} { ${field.ObjectColumns} }`;
    else
      field_definition = `${related_object_key} ${
        field.ObjectName
      } { ${refSchema.Columns(defaultFetchMode, entityStack)} }`;

    const index = entityStack.indexOf(field.ObjectName);

    if (index > 0) entityStack.splice(index, 1);

    return field_definition;
  }

  /**
   * Add a field to the schema
   *
   * @param fieldName Field name
   * @param label Default label
   * @param type Data type name
   * @param options Field options which control when the field is loaded, how it is edited and translated
   * @returns The schema for fluent API style calls
   */
  Field(
    fieldName: string,
    label: string,
    type = 'Text',
    options = defaultFieldOptions
  ): EntitySchema {
    return this.AddField({
      name: fieldName,
      label,
      type,
      options,
    } as IFieldDefinition);
  }

  /**
   * Add a field definition to the schema
   * @param fieldDefinition Field definition
   * @returns The schema for fluent API style calls
   */
  private AddField(fieldDefinition: IFieldDefinition): EntitySchema {
    this._fields.push(new EntityField(fieldDefinition));
    return this;
  }

  /**
   * Set the unique ID field for the schema
   * @param fieldName Name of the key field
   * @param fo Field options
   * @returns The schema for fluent API style calls
   */
  private SetKey(
    fieldName: string,
    fo: fieldOptions[] = hiddenFieldOptions
  ): EntitySchema {
    this._key = fieldName;
    return this.Field(fieldName, 'ID', 'id', fo);
  }

  /**
   * Connect another schema as an Enumeration
   *
   * @param schemaName Name of the schema
   * @param source_id_column Key field on the parent which connects to the child record ID
   * @param preferred_join_name The field name on the parent used to refer to the enumeration
   * @returns The schema for fluent API style calls
   */
  UseEnum(
    schemaName: string,
    source_id_column: string,
    preferred_join_name: string
  ): EntitySchema {
    const view = Query.GetView(schemaName);
    const et = view.Schema.EntityName;
    const desc = view.Schema.Label;

    return this.Fetch(
      et,
      source_id_column,
      preferred_join_name,
      'id name comment'
    ).Flatten(`${preferred_join_name}.name`, desc, defaultIntFieldOptions);
  }

  /**
   * Fetch a related record, so that fields can be imported into the parent record, as though they were columns in the same table
   *
   * @param schemaName Name of the child schema
   * @param key_column_name Name of key field on the parent that specifies the ID of the child record
   * @param ref_column_name Name of the child record to fetch
   * @param required_columns List of columns to fetch from the child
   * @returns The schema for fluent API style calls
   */
  Fetch(
    schemaName: string,
    key_column_name: string,
    ref_column_name: string,
    required_columns: string
  ): EntitySchema {
    this._includes.push({
      schema: schemaName,
      key_column_name,
      ref_column_name,
      ref_columns: required_columns,
    } as IInclude);

    return this;
  }

  /**
   * Resolve connections between this schema and others
   */
  private ResolveConnections() {
    this._includes.map((i) => {
      const view = Query.GetView(i.schema);

      const fieldDefinition = {
        name: i.schema,
        object_schema: i.schema,
        label: view.Schema.Label,
        type: 'obj',
        options: ['ontable', 'EntityEditSelect'],
        key_column_name: i.key_column_name,
        ref_column_name: i.ref_columns,
        schema: i.schema,
        object_name: i.ref_column_name,
        object_columns: i.ref_columns,
      } as IFieldDefinition;

      this.AddField(fieldDefinition);
    });
  }

  /**
   * TODO - review the purpose and functionality of this method
   * Add a relationship to a child schema, where there are multiple records at the child end
   *
   * @param schemaName Name of the child schema
   * @param ref_type Name of the field on the parent used to refer to the child schema
   * @param ref_columns Columns fetched from the child object
   * @returns The schema for fluent API style calls
   */
  AddArray(
    schemaName: string,
    ref_type: string,
    ref_columns: string
  ): EntitySchema {
    const view = Query.GetView(schemaName);

    const def = {
      name: schemaName,
      label: view.Schema.Label,
      type: 'arr',
      object_schema: ref_type,
      object_columns: ref_columns,
    } as IFieldDefinition;

    return this.AddField(def);
  }

  /**
   * Merge fields into the current object from child objects
   *
   * @param path Path to the target field, e.g. group.name
   * @param label Default label
   * @param options Used to indicate when the field is included, such as 'weight' of the field and fetch mode used
   * @returns The schema for fluent API style calls
   */
  Flatten(
    path: string,
    label: string,
    options = defaultEnumOptions
  ): EntitySchema {
    const name = path;
    const def = {
      name,
      label,
      type: 'alias',
      options,
      object_columns: path,
    } as IFieldDefinition;

    return this.AddField(def);
  }
}
