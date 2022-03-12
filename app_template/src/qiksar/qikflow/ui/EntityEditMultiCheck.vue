<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="col">
      <label>
        <b>{{ props.field.Label }}</b>
        <p>Build a multiselect checkbox list</p>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable @typescript-eslint/no-unused-vars

import EntityField from '../base/EntityField';
import { GqlRecord, GqlRecords } from '../base/GqlTypes';
import { CreateStore } from '../store/GenericStore';
import { ref, onBeforeMount } from 'vue';
import FormContext from '../forms/FormContext';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly: boolean;
}>();

if (!props.field.IsJoin)
  throw `Error: Field ${props.field.Label} must have IsJoin= true`;

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: string): void;
}>();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
let selectedObject = ref({});
let selection_records = ref([] as GqlRecords);

onBeforeMount(async () => {
  if (!props.field?.ObjectSchema) return;

  const store = CreateStore(props.field.ObjectSchema);
  await store.FetchAll().then(() => {
    const fieldName = props.field?.AffectedFieldName ?? '';
    const fieldValue = props.formContext.Root.CurrentRecord[fieldName];

    // Get the records in selection format and set the currently selected object in the store to match the ID of the selected object
    selection_records.value = store.TransformRows('selector');
    selectedObject.value = selection_records.value.filter(
      (f) => f['id'] == fieldValue
    )[0];

    //console.log(`${props.field.Name} has ${store.Rows.length} selections,  current = ${fieldValue}`);
  });
});

function selectionChanged(value: GqlRecord) {
  if (!value) return;

  selectedObject.value = value;
  const selectedId = value['id'] as string;
  emit('update:modelValue', selectedId);
}
</script>
