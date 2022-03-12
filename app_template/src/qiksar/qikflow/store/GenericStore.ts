/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { defineStore } from 'pinia';
import Query, { defaultFetchMode } from 'src/qiksar/qikflow/base/Query';
import { GqlRecords, GqlRecord } from '../base/GqlTypes';
import DataRecordState from '../base/DataRecordState';

export interface IQiksarStore {
  Rows: GqlRecords;
  CurrentRecord: GqlRecord;
  CurrentRecordId: string;
  CurrentRecordState: DataRecordState;
  IsValid: boolean;
  TableColumns: [];
  View: Query;
  HasRecord: boolean;
  IsBusy: boolean;
}

export function CreateStore<Id extends string>(name: Id) {
  const createStore = defineStore(name, {
    state: (): IQiksarStore => {
      return {
        Rows: [] as GqlRecords,
        CurrentRecord: {} as GqlRecord,
        CurrentRecordId: '',
        CurrentRecordState: DataRecordState.None,
        IsValid: false,
        TableColumns: [],
        View: {} as Query,
        HasRecord: false,
        IsBusy: false,
      };
    },

    getters: {
      Key: (state) => {
        return state.View.Entity.Key;
      },

      Busy: (state) => {
        return state.IsBusy;
      },

      Pagination: (state) => {
        return {
          sortBy: state.View.OrderBy,
          descending: !state.View.Asc,
          page: 1,
          rowsPerPage: 20,
        };
      },

      NewRecord: (state): GqlRecord => {
        store.SetCurrentRecord({});

        state.CurrentRecordId = '';

        state.IsBusy = false;
        state.HasRecord = true;
        state.CurrentRecordState = DataRecordState.New;

        return state.CurrentRecord;
      },
    },

    actions: {
      //#region initialise setup

      SetCurrentRecord(record: GqlRecord) {
        this.CurrentRecord = record;
        const id = record[this.View.Entity.Key];
        this.CurrentRecordId = (id as string) ?? '';
      },

      SetValid(isValid: boolean): void {
        this.IsValid = isValid;
      },

      SetLoaded(loaded: boolean): void {
        this.HasRecord = loaded;
      },

      SetBusy(busy: boolean): void {
        this.IsBusy = busy;
      },

      // setup the view and cache the column definitions for table presentation
      SetView(name: string): void {
        this.View = Query.GetView(name);
        this.TableColumns = <[]>this.View.TableColumns;
      },

      //#endregion

      //#region Transformers

      /**
       * Transform the records in the store into a collection that is suitable for use in a drop selector a similar compact record selection component
       *
       * @param state Transform all records in the store to a format used for selection by the user, e.g. dropdown selector
       * @returns A new collection of records, transformed into the required format
       */
      TransformRows(transformName: string): GqlRecords {
        if (this.Rows.length == 0)
          console.log(
            'Unable to build Enum Selections from empty dataset: ' +
              this.View.Entity.EntityName
          );

        const selections = [] as GqlRecords;
        const fields = this.View.Entity.GetTransform(transformName);

        this.Rows.map((r) => {
          const trn = this.View.Transform(r, fields);
          if (trn) selections.push(trn);
        });

        return selections;
      },
      //#endregion

      //#region CRUD

      //#region Fetch

      async FetchById(
        id: string,
        translate = true,
        fm = defaultFetchMode
      ): Promise<GqlRecord> {
        const record = await this.View.FetchById(id, fm, this, translate);

        if (!record)
          throw `${this.View.Entity.EntityName} not found with id '${id}'`;

        this.CurrentRecordState = DataRecordState.Unchanged;

        return record;
      },

      async FetchAll(translate = true): Promise<GqlRecords> {
        return await this.View.FetchAll(this, translate);
      },

      async FetchWhere(
        where: Record<string, any> | string,
        fm = defaultFetchMode,
        translate = true
      ): Promise<GqlRecords> {
        return await this.View.FetchWhere(where, fm, this, translate);
      },

      //#endregion

      //#region Insert

      async Add(record: GqlRecord, fm = defaultFetchMode): Promise<GqlRecord> {
        this.CurrentRecordState = DataRecordState.Unchanged;

        return await this.View.Insert(record, fm, this);
      },

      //#endregion

      //#region Update

      async Update(
        current: GqlRecord,
        original: GqlRecord
      ): Promise<GqlRecord> {
        const diff = {} as GqlRecord;

        // Get the primary key
        diff[this.Key] = this.CurrentRecordId;

        // Get only the fields which have changed value
        Object.keys(current).map((k: string) => {
          if ((current[k] as string) !== (original[k] as string))
            diff[k] = current[k];
        });

        //console.log(JSON.stringify(diff));

        const updated_record = await this.View.Update(diff, this);
        this.CurrentRecordState = DataRecordState.Unchanged;

        return updated_record;
      },

      //#endregion

      //#region Delete

      async Delete(id: string): Promise<GqlRecord> {
        if (id.length == 0) throw 'Error: id is not a valid record id';

        const record = await this.View.DeleteById(id, this);
        this.CurrentRecordState = DataRecordState.None;

        return record;
      },

      async DeleteWhere(where: string): Promise<GqlRecord> {
        return await this.View.DeleteWhere(where, this);
      },

      //#endregion

      //#endregion
    },
  });

  const store = createStore();
  store.SetView(name);

  return store;
}
