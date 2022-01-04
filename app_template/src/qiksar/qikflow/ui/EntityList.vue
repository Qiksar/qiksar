/* eslint-disable @typescript-eslint/no-unsafe-member-access */
<template>
  <q-page>
    <div class="row">
      <q-table
        dense
        :row-key="store.view.Schema.Key"
        :rows="store.Rows"
        :columns="store.TableColumns"
        :pagination="store.Pagination"
        @row-click="onRowClick"
      />
    </div>
    <div class="row">
      <q-btn @click="AddRecord()" class="q-mt-xl" :label="store.Busy ? 'Wait...' : `New ${ store.view.Schema.Description}`" />
      <q-btn @click="FetchRows()" class="q-mt-xl" :label="'Reload Data'" />
      <q-btn class="q-mt-xl" to="/" label="Home" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { onBeforeMount } from 'vue';
import { GqlRecord } from 'src/qiksar/qikflow/base/GqlTypes';
import { CreateStore } from 'src/qiksar/qikflow/store/GenericStore';
import { Router } from 'src/router'

const props = defineProps<{
  entity_type: string
}
>();

const store = CreateStore(props.entity_type);

onBeforeMount(() => {
  void FetchRows();
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRowClick = (event: any, row: GqlRecord): void => {
  if (event) {
    const key = store.view.Schema.Key;
    const path = `/${props.entity_type}/edit/${row[key] as string}`;
    void Router.push(path);
  }
}

function FetchRows(){
  /* TODO move to filters section above grid
    void entityStore.fetchWhere(`_or: [ {group: {state: {_eq: "WA"}}}, 
                                      {  group: {state: {_eq: "NSW"}}}]`, 'grid');
  */

  // don't fetch translated data for enum views
  void store.fetchAll(!store.view.IsEnum);
}

function AddRecord() {
  const path = `/${props.entity_type}/edit/new`;
  void Router.push(path);
}

/*
function DeleteRecord(entity: GqlRecord): void {
  void store.deleteWhere('email: {_eq: "' + (entity.email as string) + '"}');
}
*/

</script>
