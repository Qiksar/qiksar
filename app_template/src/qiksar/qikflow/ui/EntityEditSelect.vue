<template>
  <div class="row">
    <div class="col" v-if="props.readonly">
      <label>
        <b>{{ props.field.Label }}</b>
        <br />
        <span>{{ SelectedValue() }}</span>
      </label>
    </div>

    <div class="col" v-else>
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
import { GqlRecord, GqlRecords } from '../base/GqlTypes';
import { CreateStore } from '../store/GenericStore';
import { ref, onBeforeMount } from 'vue';
import FormContext from '../forms/FormContext';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
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

function SelectedValue(): string {
  //console.log(`${props.field.Name} - ${props.readonly ? 'readonly' : 'writeable'}`)

  const obj = selectedObject.value as GqlRecord;

  if (!obj || !obj['label']) return '';

  return obj['label'] as string;
}

onBeforeMount(async () => {
  if (!props.field?.ObjectSchema) return;

  const store = CreateStore(props.field.ObjectSchema);
  await store.FetchAll().then(() => {
    const fieldName = props.field?.AffectedFieldName ?? '';
    const fieldValue = props.formContext.Root.CurrentRecord[
      fieldName
    ] as string;

    // Get the records in selection format and set the currently selected object in the store to match the ID of the selected object
    options.value = store.TransformRows('selector');
    selectedObject.value = options.value.filter(
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
