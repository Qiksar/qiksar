<template>
  <div class="row">
    <div class="col">
    <b>Make this into a Markdown Editor</b>
      <q-input
        :label="props.field.Label"
        :model-value="props.entity[props.field.Name] as string"
        @update:modelValue="onUpdate($event)"
        debounce="1000"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';

const props = defineProps<{
  field: EntityField,
  entity: GqlRecord,
  update_mode: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

function onUpdate(value: string) {
  if (!value)
    return;

  emit('update:modelValue', value);
}

</script>