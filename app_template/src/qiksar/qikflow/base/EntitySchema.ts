import EntityField, {defaultFieldOptions, hiddenFieldOptions, defaultEnumOptions, defaultIntFieldOptions } from './EntityField';
import fieldOptions from './fieldOptions';
import IFieldDefinition from './IFieldDefinition';
import { TranslateRecord } from './GqlTypes';
import Query, { defaultFetchMode } from './Query';
import fetchMode from './fetchMode';
import IInclude from './IInclude';
import { t } from 'src/qiksar/Translator/Translator';

export default class EntitySchema {
    private _description: string;
    private _entityType: string;
    private _fields: Array<EntityField>;
    private _key: string;
    private _is_enum: boolean;
    private _includes: IInclude[];
	private _createSelection: TranslateRecord;

    private static _schemas:Array<EntitySchema> = [];
    static get Schemas(): Array<EntitySchema> { return this._schemas; } 

    get SelectionTranslator(): TranslateRecord { return this._createSelection; }
    ToSelection(f:TranslateRecord):EntitySchema {
        this._createSelection = f;
        return this;
    }
    
    constructor(entityType: string, key:string, description: string, isEnum = false) {
        this._entityType = entityType.toLowerCase();
        this._key = key;
        this._description = description;
        this._fields = new Array<EntityField>();
        this._is_enum = isEnum;
        this._includes = [];
        this._createSelection = ({}) => { return { id: 'Use ToSelection', Description:''} };
    }

    static ResolveReferences():void {
        this._schemas.map(s => s.Resolve());
    }

    static GetSchemaForEntity(entityName: string): EntitySchema|null {
        entityName = entityName.toLowerCase();
     
        const schemas = this._schemas.filter((s:EntitySchema) => s.EntityType === entityName);

        return schemas.length > 0 ? schemas[0] : null;
    }

    static Create(entityType: string, key:string, description: string | undefined): EntitySchema {
        entityType = entityType.toLowerCase();
      
        const schema: EntitySchema = new EntitySchema(entityType, key, description ?? entityType);

        if(this.GetSchemaForEntity(entityType))
            throw `!!!! FATAL ERROR: Schema has already been registered for entity type${schema.EntityType}`

        this._schemas.push(schema);

        return schema.SetKey(key);
    }

    static CreateEnum(entityType: string, description: string | undefined): EntitySchema {
        const key = 'id';
        entityType = entityType.toLowerCase();

        const schema: EntitySchema = new EntitySchema(entityType, key, description ?? entityType, true);

        if(this.GetSchemaForEntity(entityType))
            throw `!!!! FATAL ERROR: Schema has already been registered for entity type${schema.EntityType}`

        this._schemas.push(schema);
        
        return schema
            .SetKey(key, ['sortable'])
            .Field('name', 'Label')
            .Field('comment', 'Description')
            .ToSelection((r) => { 
                return {
                    id: r[key],
                    label: t(r.name as string),
                    description: t(r.comment as string),
                }
            });
    }

    get Description(): string { return this._description}
    get EntityType(): string { return this._entityType}
    get Fields(): EntityField[] { return this._fields}
    get Key():string { return this._key}
    get IsEnum():boolean{return this._is_enum}

    get LocaleFields(): EntityField[] { return  this._fields.filter(f => f.IsLocale)}

    Columns(fetch_mode:fetchMode, entityStack:string[]): string {
        let columns = '';
        let  fields = this.Fields;

        switch(fetch_mode)
        {
            case 'grid':
                fields = fields.filter(f => f.IsKey || f.IsOnTable);
                break;

            case 'light':
                fields = fields.filter(f => f.IsKey || !f.IsHeavy);
                break;

            case 'heavy':
                // all fields are returned
                break;
        }

        fields.map(f => columns += this.FieldToGql(f, entityStack) + ' ');
        
        return columns;
    }

    FieldToGql(field: EntityField, entityStack:string[]):string {
        if('arr obj alias'.indexOf(field.Type) == -1)
            return field.Name;

        if( (field.Type == 'arr' || field.Type == 'obj') && entityStack.filter(e => e === field.ObjectName).length == 0) {
            return this.RelatedObjectToGql(field, entityStack);
        }

        return '';
    }

    RelatedObjectToGql(field: EntityField, entityStack:string[]):string {
        if (!field.ObjectSchema)
            throw `Schema reference is missing on ${this.EntityType}.${field.Name}`;

        if (!field.ObjectName)
            throw `Fieldname of object must be specified on field ${JSON.stringify(field)}`;
        
        let field_definition = null;
        
        entityStack.push(field.ObjectSchema);

        const refSchema = EntitySchema.GetSchemaForEntity(field.ObjectSchema);

        if(!refSchema)
            throw `!!!! FATAL ERROR: Entity ${this.EntityType} references unknown schema ${field.ObjectName}`

        // when a referenced object is required the object's key is required in addition to the object
        // and it's nominated fields. e.g. role_id role {name comment}
        // role_id can then be edited in the UI and updated
        const related_object_key = (field.KeyColumnName ?? '');
        // fetch only the nominated columns, or if none are nominated, fetch all
        if(field.ObjectColumns)
            field_definition = `${related_object_key} ${field.ObjectName} { ${field.ObjectColumns} }`;
        else
            field_definition = `${related_object_key} ${field.ObjectName} { ${refSchema.Columns(defaultFetchMode, entityStack)} }`;

        const index = entityStack.indexOf(field.ObjectName);
        
        if(index > 0)
            entityStack.splice(index,1);
    
        return field_definition;
    }

    Field(name: string, label: string, type='Text', options=defaultFieldOptions): EntitySchema
    {
        return this.AddField(
            {
                name, 
                label, 
                type,
                options
            } as IFieldDefinition);
    }

    AddField(def: IFieldDefinition): EntitySchema 
    {
        this._fields.push(new EntityField(def));
        return this;
    }

    SetKey(name: string, fo: fieldOptions[]=hiddenFieldOptions): EntitySchema {
        this._key = name;
        return this.Field(name, 'ID', 'id', fo);
    }

    UseEnum(view_name:string,  source_id_column: string, preferred_join_name: string): EntitySchema {
        const view = Query.GetView(view_name);
        const et = view.Schema.EntityType;
        const desc =view.Schema.Description;

        return this
            .Include(et, source_id_column, preferred_join_name, 'id name comment')
            .Flatten(`${preferred_join_name}.name`, desc, defaultIntFieldOptions);
    }

    Include(schema: string, key_column_name:string, ref_column_name: string, required_columns:string): EntitySchema {
        this._includes.push(({
            schema,
            key_column_name,
            ref_column_name,
            ref_columns: required_columns
        } as IInclude))

        return this;
    }

    Resolve(){
        this._includes.map(i => {
            const view = Query.GetView(i.schema);
            const def = {
                name:i.schema,
                object_schema: i.schema,
                label: view.Schema.Description,
                type:'obj',
                options: ['ontable', 'EntityEditSelect'],
                key_column_name: i.key_column_name,
                ref_column_name: i.ref_columns,
                schema: i.schema,
                object_name:i.ref_column_name,
                object_columns: i.ref_columns
            } as IFieldDefinition;
            this.AddField(def);
        });
    }

    AddArray(schema_name: string, ref_type: string, ref_columns:string): EntitySchema {
        const view = Query.GetView(schema_name);

        const def = {
            name: schema_name,
            label: view.Schema.Description,
            type: 'arr',
            object_schema: ref_type,
            object_columns: ref_columns
        } as IFieldDefinition

        return this.AddField(def);
    }

    Flatten(path: string, label: string, options = defaultEnumOptions):EntitySchema {
        const name=path;
        const def = {
            name,
            label,
            type: 'alias',
            options,
            object_columns: path
        } as IFieldDefinition

        return this.AddField(def);
    }
}
