<template>
  <q-page>
    <div class="row">
      <q-table
        dense
        :row-key="store.Key"
        :rows="store.Rows"
        :columns="store.TableColumns"
        :pagination="store.Pagination"
        @row-click="onRowClick"
      />
    </div>
    <div class="row">
      <q-btn
        @click="AddRecord()"
        class="q-mt-xl"
        :label="store.Busy ? 'Wait...' : `New ${store.View.Entity.Label}`"
      />
      <q-btn @click="FetchRows()" class="q-mt-xl" :label="'Reload Data'" />
      <q-btn class="q-mt-xl" to="/" label="Home" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";
import Qiksar from "src/qiksar/qiksar";

import { GqlRecord } from "src/qiksar/qikflow/base/GqlTypes";
import { CreateStore } from "src/qiksar/qikflow/store/GenericStore";

const props = defineProps<{
  entity_type: string;
}>();

const store = CreateStore(props.entity_type);

onBeforeMount(() => {
  void FetchRows();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRowClick = (event: any, row: GqlRecord): void => {
  if (event) {
    const key = store.Key;
    const path = `/${props.entity_type}/edit/${row[key] as string}`;
    void Qiksar.Router.push(path);
  }
};

function FetchRows() {
  // don't fetch translated data for enum views
  void store.FetchAll(!store.View.IsEnum);
}

function AddRecord() {
  const path = `/${props.entity_type}/edit/new`;
  void Qiksar.Router.push(path);
}

/*
function DeleteRecord(entity: GqlRecord): void {
  void store.deleteWhere('email: {_eq: "' + (entity.email as string) + '"}');
}
*/
</script>
