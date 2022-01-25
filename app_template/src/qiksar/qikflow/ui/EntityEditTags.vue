/* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable
@typescript-eslint/no-explicit-any */

<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="col">
      <label>
        <b>{{ props.field.Label }}</b>
        <p>Build a multitag selector</p>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EntityField from '../base/EntityField';
import { GqlRecord, GqlRecords } from '../base/GqlTypes';
import { CreateStore } from '../store/GenericStore';
import { ref, onBeforeMount } from 'vue';

const props = defineProps<{
  field: EntityField;
  entity: GqlRecord;
  readonly: boolean;
}>();

if (!props.field.IsRelation)
  throw `Field ${props.field.Label} can not be used a data source for selectors, field type must = 'obj'`;

if (!props.field.ObjectSchema)
  throw `Field ${props.field.Label} does not reference a schema so can not be used as a data source for selectors`;

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: string): void;
}>();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
let selectedObject = ref({});
let options = ref([] as GqlRecords);

onBeforeMount(async () => {
  if (!props.field?.ObjectSchema) return;

  const store = CreateStore(props.field.ObjectSchema);
  await store.FetchAll().then(() => {
    const fieldName = props.field?.AffectedFieldName ?? '';
    const fieldValue = props.entity[fieldName];

    // Get the records in selection format and set the currently selected object in the store to match the ID of the selected object
    options.value = store.TransformRows('selector');
    selectedObject.value = options.value.filter(
      (f: GqlRecord) => f['id'] == fieldValue
    )[0];

    //console.log(`${props.field.Name} has ${store.Rows.length} selections,  current = ${fieldValue}`);
  });
});

function selectionChanged(value: GqlRecord) {
  if (!value) return;

  selectedObject.value = value;
  const key = value['id'] as string;
  emit('update:modelValue', key);
}
</script>
