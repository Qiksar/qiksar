import Query, { defaultFetchMode } from 'src/qiksar/qikflow/base/Query'
import { defineStore } from 'pinia';
import { GqlRecords, GqlRecord } from '../base/GqlTypes';

export function CreateStore<Id extends string>(name: Id) {
  const createStore = defineStore(name, {

    state: () => {
      return {
        Rows: [] as GqlRecords,
        CurrentRecord: {} as GqlRecord,
        busy: false,
        hasRecord: false,
        TableColumns: [],
        view: {} as Query,
      }
    },

    getters: {

      Busy: (state) => { return state.busy },
     
      RecordLoaded: (state) => { return state.hasRecord },

      Pagination: (state) => {
        return {
          sortBy: state.view.SortBy,
          descending: !state.view.Asc,
          page: 1,
          rowsPerPage: 20
        }
      },


      NewRecord: (state): GqlRecord => {
        state.CurrentRecord = {};
        
        state.busy = false;
        state.hasRecord=true;

        return state.CurrentRecord;
      }
    },

    actions: {

      //#region initialise setup

      SetLoaded(loaded: boolean):void {
        this.hasRecord = loaded;
      },

      SetBusy(busy = true): void {
        this.busy = busy;
      },

      // setup the view and cache the column definitions for table presentation 
      SetView(name: string): void {
        this.view = Query.GetView(name);
        this.TableColumns = <[]>this.view.TableColumns;
      },

      //#endregion

      //#region Transformers

      /**
       * Transform the records in the store into a collection that is suitable for use in a drop selector a similar compact record selection component
       * 
       * @param state Transform all records in the store to a format used for selection by the user, e.g. dropdown selector
       * @returns A new collection of records, transformed into the required format
       */
       TransformRows(transformName:string): GqlRecords {
        if (this.Rows.length == 0)
          console.log('Unable to build Enum Selections from empty dataset: ' + this.view.Schema.EntityName);

          const selections = [] as GqlRecords;

          const fields = this.view.Schema.GetTransform(transformName);

          this.Rows.map(r => {
            const trn = this.view.Transform(r, fields);
            if(trn)
              selections.push(trn)}
            );
      
          return selections;
      },
      //#endregion

      //#region CRUD

      //#region Fetch

      async FetchById(id: string, translate = true, fm = defaultFetchMode): Promise<GqlRecord> {
        const record = await this.view.FetchById(id, fm, this, translate);

        if (!record)
          throw `${this.view.Schema.EntityName} not found with id '${id}'`;

        return record;
      },

      async FetchAll(translate = true): Promise<GqlRecords> {
        return await this.view.FetchAll(this, translate);
      },

      async FetchWhere(where: string, fm = defaultFetchMode, translate = true): Promise<GqlRecords> {
        return await this.view.FetchWhere(where, fm, this, translate);
      },

      //#endregion

      //#region Insert

      async Add(record: GqlRecord, fm = defaultFetchMode): Promise<GqlRecord> {
        return await this.view.Insert(record, fm, this);
      },

      //#endregion

      //#region Update

      async Update(current: GqlRecord, original: GqlRecord): Promise<GqlRecord> {
        const diff = {} as GqlRecord;

        // Get the primary key
        diff[this.view.Schema.Key] = this.CurrentRecord[this.view.Schema.Key] as string;

        // Get only the fields which have changed value
        Object.keys(current).map((k: string) => {
          if (current[k] as string !== original[k] as string)
            diff[k] = current[k];
        })

        //console.log(JSON.stringify(diff));

        return await this.view.Update(diff, this);
      },

      //#endregion

      //#region Delete

      async Delete(id: string): Promise<GqlRecord> {
        return await this.view.DeleteById(id, this);
      },

      async DeleteWhere(where: string): Promise<GqlRecord> {
        return await this.view.DeleteWhere(where, this);
      }

      //#endregion

      //#endregion

    }
  });

  const store = createStore();
  store.SetView(name);

  return store;
}