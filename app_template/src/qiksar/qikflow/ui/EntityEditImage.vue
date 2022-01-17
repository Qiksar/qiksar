/* eslint-disable @typescript-eslint/no-unused-vars */

<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="col">
      <label>
        <b>{{ props.field.Label }}</b>
        <p>Build an image picker with camera access</p>
      </label>
    </div>
  </div>
</template>

<script lang='ts' setup>

import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';

const props = defineProps<{
  field: EntityField;
  entity: GqlRecord;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onUpdate(value: string) {
  if (!value) return;

  emit('update:modelValue', value);
}
</script>
