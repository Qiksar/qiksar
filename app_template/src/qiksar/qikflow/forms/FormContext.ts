/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import EntityField from '../base/EntityField';
import { GqlRecord, GqlRecords } from '../base/GqlTypes';
import IJoinUsage from '../base/IJoinUsage';
import Query from '../base/Query';
import { CreateStore, IQiksarStore } from '../store/GenericStore';

/**
 * The form context is intended to support complex form hierarchies where a root object (e.g. a Blog Post) can have fields which are concretely represented in many to many joins (such as Tags on the Blog Post).
 *
 * The root object is a strongly typed definition of a generic store, and is available to all fields on the form.
 *
 * The store itself is a more complex type, and methods are not directly exposed, rather they are wrapped, which keeps the more complex store type hidden.
 * The form in which the context is created can then use simple CRUD methods to create and maintain data.
 *
 */
export default class FormContext {
  private root: IQiksarStore | undefined;
  private add: any;
  private update: any;
  private delete: any;

  /**
   * Strongly type definition for a generic data store
   */
  get Root(): IQiksarStore {
    if (!this.root) throw 'Error: Context has not been initialised';

    return this.root;
  }

  /**
   * The id of the top most record
   */
  get RootRecordId(): string | undefined {
    return this.root?.CurrentRecordId;
  }

  /**
   * Initialise the context, and fetch any specified record
   *
   * @param entityName The name of the entity type
   * @param id the ID of the entity
   * @returns a new record, or the record matching the specified ID
   */
  async Initialise(
    entityName: string,
    id: string | undefined = undefined
  ): Promise<GqlRecord> {
    const store: any = CreateStore(entityName);
    this.root = store as unknown as IQiksarStore;

    // -----------------------

    this.add = async (r: GqlRecord) => {
      return await store.Add(r);
    };

    this.update = async (fieldName: string, value: number | string) => {
      const original = { ...store.CurrentRecord };
      store.CurrentRecord[fieldName] = value;

      if (store.CurrentRecordId) {
        await store.Update(store.CurrentRecord, original);
      }

      return store.CurrentRecord;
    };

    this.delete = async (store: any) => {
      await store.Delete(store.CurrentRecordId);
    };

    // -----------------------

    if (id && id.length > 0 && id != 'new') {
      return await store.FetchById(id, !this.root.View.IsEnum);
    } else {
      return store.NewRecord;
    }
  }

  /**
   *
   * @param entityField Once the root record has been acquired, call this method with an entity field
   * that utilisies a many to many join,
   *
   * The matching child records will be automatically acquired and returned.
   * pseudo code: return article_tags where article_id == id of RootRecord
   *              article_tags is the many to many join table in the database
   *              article_tags.article_id matches to the context's RootRecordId
   *
   * @returns Child records
   */
  public async FetchChildren(entityField: EntityField): Promise<GqlRecords> {
    if (!this.RootRecordId) throw 'Error: No root record has been acquired';

    // The field tells us which join is being used
    const joinUsage = entityField.FieldDefinition as unknown as IJoinUsage;

    // Retrieve the join definition
    const joinDefinition = Query.GetJoinDefinition(joinUsage.join_table);

    // Now we can get the key field from the join which matches to the ID of the root record
    const where_clause = `${joinDefinition.master_key}: {_eq: "${this.RootRecordId}"}`;

    return await CreateStore(joinUsage.join_table).FetchWhere(where_clause);
  }

  /**
   * Get the definition of all fields on the entity that are editable
   *
   * @returns A Dictionary of field definitions which represent those fields of the entity which are editable
   */
  public EditableFields(): Record<string, EntityField> {
    // Get a collection of editable fields
    return this.Root.View.EditableFields ?? {};
  }

  /**
   * Insert a new record into the database, which will become the root record of the context
   *
   * @param record the record to be inserted
   * @returns the fully populated record, as the insert process will create the unique ID of the record
   */
  public async Add(record: GqlRecord): Promise<GqlRecord> {
    return await this.add(record);
  }

  /**
   * Update the root record
   *
   * @param fieldName Name of field to update
   * @param value Value to assign to the field
   * @returns Updated record
   */
  public async Update(
    fieldName: string,
    value: string | number | undefined
  ): Promise<GqlRecord> {
    return await this.update(fieldName, value);
  }

  /**
   * Delete the current record and invalidate the context.
   *
   * After the root record is deleted, all the CRUD methods are invalidated, and no further changes to data can be made through the context.
   */
  public async Delete() {
    await this.delete();

    // Invalidate the context, as once the root record is deleted, all context is irrelevant
    this.root = undefined;
    this.add = undefined;
    this.update = undefined;
    this.delete = undefined;
  }
}
