/* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable
@typescript-eslint/no-explicit-any */

<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="col">
      <label>
        <b>{{ props.field.Label }}</b>
        <p>Build a multi-tag selector</p>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';
import { CreateStore } from '../store/GenericStore';
import { onBeforeMount } from 'vue';
import FormContext from '../forms/FormContext';
import IJoinUsage from '../base/IJoinUsage';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly: boolean;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: string): void;
}>();

if (!props.field.IsJoin)
  throw `Error: Field ${props.field.Label} must have IsJoin= true`;


onBeforeMount(async () => {

  const parent_id = props.formContext.Root.CurrentRecordId;
  const join = (props.field.FieldDefinition as unknown) as IJoinUsage;
  const store = CreateStore(join.join_table);
  console.log('Parent ID: ', parent_id)

  const where_clause = `article_id: {_eq: "${parent_id}"}`;
  // TODO have to serialise JSON without keynames being quoted. Can we just use gql ``?
  //const where_clause = { article_id: { _eq: parent_id } };

  const rows = await store.FetchWhere(where_clause);

  // Here are all the tags connected to the current article
  console.log('Here are all child records connected to the parent record');
  rows.map((r: GqlRecord) => console.log(JSON.stringify(r)))
});

</script>
