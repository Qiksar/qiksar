import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import gql from 'graphql-tag';
import EntityField, { fieldType } from './EntityField';
import EntitySchema from './EntitySchema';
import { TypePolicies } from '@apollo/client/core';
import { t } from 'src/boot/i18n';
import { fromJSON, toJSON } from 'flatted';
import { GqlRecord, GqlRecords } from './GqlTypes';

export type fetchMode = 'heavy' | 'light' | 'grid';
export const defaultFetchMode: fetchMode = 'heavy';
export interface ITableColumn {
	name: string;
	label: string;
	field: string;
	sortable: boolean;
	align: 'right' | 'left';
}

export default class Query {
	//#region instance variables

	private _offset: number;
	private _limit: number | undefined;
	private _sort_by: string;
	private _asc: boolean;
	private _schema: EntitySchema;
	private _where: string | undefined;
	private _fetch_mode: fetchMode;
	private _auto_fetch: boolean;

	private static _apollo: ApolloClient<NormalizedCacheObject>;
	public static set Apollo(client: ApolloClient<NormalizedCacheObject>) { Query._apollo = client; }
	public static get Apollo(): ApolloClient<NormalizedCacheObject> { 
		if(!Query._apollo)
			throw `${typeof Query}: Apollo client not specified`;

		return Query._apollo; 
	}

	//#endregion

	//#region static members

	// Static array of all views
	private static _views: Array<Query> = [];

	static get ApolloTypePolicies(): TypePolicies {
		const tp = {} as GqlRecord;

		this._views.map((v) => {
			tp[v.Schema.EntityType] = { keyFields: [v.Schema.Key] };
		});

		//console.log(JSON.stringify(tp));

		return tp as TypePolicies;
	}

	// Retrieve a view by name
	static GetView(entityName: string): Query {
		const views = Query._views.filter(
			(v) => v.Schema.EntityType === entityName
		);

		if (views.length == 0)
			throw `!!!! FATAL ERROR: Schema for entity type ${entityName} has not been registered`;

		return views[0];
	}

	//#endregion

	//#region Properties

	get Schema(): EntitySchema {
		return this._schema;
	}
	get IsEnum(): boolean {
		return this.Schema.IsEnum;
	}

	set Limit(limit: number | undefined) {
		this._limit = limit;
	}
	get Limit(): number | undefined {
		return this._limit;
	}

	set Offset(offset: number) {
		this._offset = offset;
	}
	get Offset(): number {
		return this._offset;
	}

	set SortBy(sort_by: string) {
		this._sort_by = sort_by;
	}
	get SortBy(): string {
		return this._sort_by;
	}

	set Asc(asc: boolean) {
		this._asc = asc;
	}
	get Asc() {
		return this._asc;
	}

	get AutoFetch() {
		return this.IsEnum || this._auto_fetch;
	}

	//#endregion

	//#region select fields by editable status or data type

	get EditableFields(): Record<string, EntityField> {
		const fields = {} as Record<string, EntityField>;

		this.Schema.Fields.filter((f) => {
			return f.IsRelation || (!f.IsKey && !f.IsAlias);
		}).map((f) => (fields[f.Name] = f));

		return fields;
	}

	FieldsOfType(t: fieldType): Array<EntityField> {
		return this.Schema.Fields.filter((f: EntityField) => {
			return f.Type === t;
		});
	}

	get TableColumns(): ITableColumn[] {
		const fields: ITableColumn[] = [];

		this.Schema.Fields.filter((f) => f.IsOnTable && !f.IsRelation).map(
			(f) => {
				fields.push({
					name: f.Name,
					label: t(f.Label),
					field: f.Name,
					sortable: f.IsSortable,
					align: f.Type == 'number' ? 'right' : 'left',
				});
			}
		);

		return fields;
	}

	//#endregion

	//#region constructor

	constructor(
		schema: EntitySchema,
		autoFetch = false,
		sort_by: string | undefined = undefined,
		asc = true,
		limit: number | undefined
	) {
		this._schema = schema;
		this._sort_by = sort_by ?? schema.Key;
		this._asc = asc;
		this._limit = limit;
		this._offset = 0;
		this._where = undefined;
		this._fetch_mode = defaultFetchMode;
		this._auto_fetch = autoFetch;

		Query._views.push(this);
	}

	//#endregion

	//#region query builder

	// Build a GrapQL query based on the schema
	
	private BuildQuery(
		where: string | undefined,
		fm: fetchMode = defaultFetchMode,
		query_name: string | undefined = undefined,
		sortBy: string | undefined = undefined,
		limit: number | undefined = undefined
	) {
		const entityStack: string[] = [];

		limit = limit ?? this.Limit;

		const query =
			`query fetch_${query_name ?? this.Schema.EntityType} {
            ${this.Schema.EntityType}
            (` +
			(limit ? `limit: ${limit},` : '') +
			`
                offset: ${this.Offset}, 
                ${this.BuildOrderBy(this.SortBy, sortBy)}
                ${this.BuildWhere(where)}
            )  
            {
                ${this.Schema.Columns(fm, entityStack)}
            }
        },
        `;

		const doc = {
			query: gql(query),
		};

		//console.log(query);
		return doc;
	}

	// Build a where clause if specified
	private BuildWhere(where: string | undefined): string {
		return where ? `, where: { ${where} }` : '';
	}

	// If a where clause is specified then use it, else fall back to the default sort of the view
	private BuildOrderBy(
		sortBy: string | undefined,
		where: string | undefined
	): string {
		const sort_option = sortBy
			? `order_by: {${this.SortBy}: ${this.Asc ? 'asc' : 'desc'}}`
			: undefined;
		const where_option = where ? `order_by: {${where}}` : undefined;

		return where_option ?? sort_option ?? '';
	}

	//#endregion

	//#region Row / Alias processing

	// Process all rows to apply aliasing
	private ProcessAllRows(rows: GqlRecords, translate = true): GqlRecords {
		if (!rows) return [];

		const output: GqlRecords = [];
		rows.map((r) => output.push(this.ProcessRow(r, translate)));

		return output;
	}

	// process rows read from the database, includes flattened, translated (locale) and JSON formats
	private ProcessRow(row: GqlRecord, translate = true): GqlRecord {
		const output: GqlRecord = { ...row };

		// import flattened objects from json
		this.FieldsOfType('json').map((json_field) => {
			output[json_field.Name] = fromJSON(row[json_field.Name]);
		});

		// process flattened fields, where values are pulled up to the current object from
		// related objects
		this.FieldsOfType('alias').map((alias_field) => {
			let alias_value = '';

			if (alias_field && alias_field.ObjectColumns) {
				alias_field.ObjectColumns.split(' ').map((a) => {
					alias_value += this.GetAliasValue(output, a) + ' ';
				});
				output[alias_field.Name] = alias_value.trim();
			}
		});

		// attempt to translate all text fields
		if (translate) {
			this.Schema.LocaleFields.map((f) => {
				if (output[f.Name]) {
					const val = output[f.Name] as string;
					if (val.length != 0) output[f.Name] = t(val, true);
				}
			});
		}

		return output;
	}

	// Process rows ready to be written to database
	private PrepareRowForSave(row: GqlRecord): GqlRecord {
		const output: GqlRecord = { ...row };

		// import flattened objects from json
		this.FieldsOfType('json').map((json_field) => {
			output[json_field.Name] = toJSON(row[json_field.Name]);
		});

		return output;
	}

	// Get the value of an alias, which is an attribute of a nested object, e.g. customer.address.zipcode
	private GetAliasValue(source: GqlRecord, alias: string): string {
		if (!alias || alias.length == 0) throw `Invalid alias: ${alias}`;

		const value = this.Extract<string>(source, alias.split('.'));
		return value ?? '---';
	}

	// Convert objects for use in GraphQL statements
	private Stringify(data: GqlRecord, addComma = false): string {
		if (!data) return '';

		let output = '';
		Object.keys(data).map(
			(k) =>
			(output += `${k}: "${data[k] as string}" ${addComma ? ', ' : ''
				}`)
		);
		return output;
	}

	//#endregion

	//#region CRUD

	// Return result, loading, error to the caller
	// This enables the query to execute asynchronously, and when loading = false, the result is ready
	async FetchAll(
		store: any,
		translate = true,
		limit = undefined
	): Promise<GqlRecords> {
		store.SetBusy(true);

		const query = this.BuildQuery(undefined, undefined, undefined, limit);
		const r = await Query.Apollo.query(query).catch((e) => {
			throw e;
		});

		this.SetRows(r, store, translate);

		store.SetBusy(false);
		store.SetLoaded(true);

		return store.Rows;
	}

	// Fetch multiple records matching a where clause. If the where clause is not provided, the previous where clause is used.
	// If there is no previous where clause then all rows will be returned
	async FetchWhere(
		where: string | undefined,
		fm: fetchMode | undefined,
		store: any,
		translate = true,
		query_name: string | undefined = undefined,
		orderBy: string | undefined = undefined,
		limit = undefined
	): Promise<GqlRecords> {
		if (!where) where = this._where;

		if (!fm) fm = this._fetch_mode;

		store.SetBusy(true);

		const r = await Query.Apollo.query(
			this.BuildQuery(where, fm, query_name, orderBy, limit)
		);

		this.SetRows(r, store, translate);

		this._where = where;
		this._fetch_mode = fm;

		store.SetBusy(false);
		store.SetLoaded(true);

		return store.Rows;
	}

	// Attempt to fetch a single record given its primary key value
	async FetchById(
		id: string,
		fm = defaultFetchMode,
		store: any,
		translate = true
	): Promise<GqlRecord> {
		store.SetBusy(true);
		const query_name = `${this.Schema.EntityType}_by_id`;
		const r = await Query.Apollo.query(
			this.BuildQuery(`${this.Schema.Key}: { _eq: ${id}}`, fm, query_name)
		);

		const rows = <[]>r.data[this.Schema.EntityType];
		if (rows.length) {
			const row = this.ProcessAllRows(rows, translate);
			store.CurrentRecord = row[0];
		} else {
			store.CurrentRecord = {};
		}

		store.SetBusy(false);
		store.SetLoaded(true);

		return store.CurrentRecord;
	}

	// Repeat previous fetch
	async Refetch(store: any): Promise<void> {
		await this.FetchWhere(this._where, this._fetch_mode, store);

		store.SetBusy(false);
		store.SetLoaded(true);
	}

	SetRows(result: GqlRecord, store: any, translate = true) {
		const rows = this.Extract<GqlRecords>(result, [
			'data',
			this.Schema.EntityType,
		]);

		store.Rows = this.ProcessAllRows(rows, translate);
		store.SetBusy(false);
		store.SetLoaded(true);

		//const first = store.Rows[0] as GqlRecord;
		//console.log('----------------------------------------------------')
		//console.log(JSON.stringify(first))
		//console.log('----------------------------------------------------')
	}

	async Insert(
		data: GqlRecord,
		fm = defaultFetchMode,
		store: any
	): Promise<GqlRecord> {
		// convert objects to JSON
		data = this.PrepareRowForSave(data);

		const mutation_name = `insert_${this.Schema.EntityType}`;
		const doc = `
            mutation {
                ${mutation_name} (
                    objects: [{ ${this.Stringify(data)} }]
                ) {
                    returning { ${this.Schema.Key}}
                }
            }`;

		const r: GqlRecord = await this.doMutation(doc, 'insert', store);
		const id = this.Extract<string>(r, [
			'data',
			mutation_name,
			'returning',
			0,
			this.Schema.Key,
		]);

		store.CurrentRecord = await this.FetchById(id, fm, store);

		store.SetBusy(false);
		store.SetLoaded(true);

		return store.CurrentRecord;
	}

	// If id is missing, handle as an insert, else do an update
	async Update(data: GqlRecord, store: any): Promise<GqlRecord> {
		data = this.PrepareRowForSave(data);

		const id = data[this.Schema.Key] as string;

		if (!id)
			throw `Unable to get primary key from ${this.Schema.EntityType}:${this.Schema.Key} = '${id}'`;

		let keys = '';
		Object.keys(data).map((k) => (keys += `${k} `));

		const mutation_name = `update_${this.Schema.EntityType}_by_pk`;
		const doc = `
            mutation {
                ${mutation_name} (
                    pk_columns: {
                        ${this.Schema.Key}: ${id}
                        }, 
                    _set: {
                        ${this.Stringify(data, true)}
                        }
                    ) 
                    { ${keys} }
            }`;

		const r = await this.doMutation(doc, 'update', store);

		store.SetBusy(false);
		store.SetLoaded(true);

		return r;
	}

	async DeleteById(id: string, store: any): Promise<GqlRecord> {
		if (!id)
			throw `Unable to get primary key from ${this.Schema.EntityType}:${this.Schema.Key}`;

		const mutation_name = `delete_${this.Schema.EntityType}_by_pk`;
		const doc = `
            mutation {
            ${mutation_name} (where: { ${this.Schema.Key}: {_eq: "${id}"} }
                ) {
                    returning { ${this.Schema.Key} }
                }
            }`;

		const res = await this.doMutation(doc, 'delete_id', store);

		store.CurrentRecord = {};
		store.SetBusy(false);
		store.SetLoaded(false);

		return res;
	}

	async DeleteWhere(where: string, store: any): Promise<GqlRecord> {
		const mutation_name = `delete_${this.Schema.EntityType}`;
		const doc = `
            mutation delete_${this.Schema.EntityType}_where {
            ${mutation_name} (where: { ${where} }
            ) {
                returning { ${this.Schema.Key} }
            }
        }`;

		const res = await this.doMutation(doc, 'delete_multi', store);

		store.CurrentRecord = {};
		store.SetBusy(false);
		store.SetLoaded(false);

		return res;

	}

	private async doMutation(
		mutation: string,
		operation: string,
		store: any
	): Promise<GqlRecord> {
		const doc = { mutation: gql(mutation) };
		store.SetBusy(true);

		//console.log('**** mutate input: ' + mutation);

		const r = await Query.Apollo.mutate(doc);

		//console.log('**** mutate output: ' + JSON.stringify(r));
		void this.Refetch(store);

		return r as GqlRecord;
	}

	// Given an object, extract a value from a dynamically specified path, e.g. result.data.members[0]
	Extract<Type>(data: GqlRecord, path: any[]): Type {
		let field = data;
		path.map((p) => (field = field[p] as GqlRecord));

		return field as Type;
	}

	//#endregion
}
