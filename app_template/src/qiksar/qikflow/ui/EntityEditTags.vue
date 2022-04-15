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
import { onBeforeMount, ref } from 'vue';

import EntityField from '../base/EntityField';
import FormContext from '../forms/FormContext';
import { GqlRecords } from '../base/GqlTypes';

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
  throw `Error: Field definition for '${props.field.Label}' must have IsJoin= true`;

// TODO move to mixin?
const rows = ref({});
async function fetch(): Promise<GqlRecords> {
  return await props.formContext.FetchChildren(props.field);
}
onBeforeMount(async () => {
  rows.value = await fetch();
});
</script>
