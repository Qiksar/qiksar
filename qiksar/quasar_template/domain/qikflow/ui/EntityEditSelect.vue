<template>
  <div class="row">
    <div class="col">
      <q-select
        :model-value="selectedObject"
        :options="options"
        :label="props.field.Label"
        option-value="id"
        option-label="label"
        map-options
        @update:modelValue="selectionChanged($event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

import EntityField from '../base/EntityField';
import { GqlRecord, GqlRecords } from '../base/Query';
import { CreateStore } from '../store/GenericStore';
import { ref, onBeforeMount } from 'vue';

const props = defineProps<{
  field: EntityField,
  entity: GqlRecord
}>();

if (!props.field.IsRelation)
  throw `Field ${props.field.Label} can not be used a data source for selectors, field type must = 'obj'`;

if (!props.field.ObjectSchema)
  throw `Field ${props.field.Label} does not reference a schema so can not be used as a data source for selectors`;

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: number): void
}>();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
let selectedObject = ref({});
let options = ref([] as GqlRecords);

onBeforeMount(async () => {
  if (!props.field?.ObjectSchema)
    return;

  const store = CreateStore(props.field.ObjectSchema);
  await store.fetchAll()
    .then(() => {
      const fieldName = props.field?.AffectedFieldName ?? '';
      const fieldValue = props.entity[fieldName] as number;

      options.value = store.GetSelections;
      selectedObject.value = options.value.filter(f => f['id'] == fieldValue)[0];
      
      //console.log(`${props.field.Name} has ${store.Rows.length} selections,  current = ${fieldValue}`);
    })
});

function selectionChanged(value: GqlRecord) {
  if (!value)
    return;

  selectedObject.value = value;
  emit('update:modelValue', value['id'] as number);
}

</script>