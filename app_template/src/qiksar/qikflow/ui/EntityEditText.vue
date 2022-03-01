// https://quasar.dev/vue-components/input

<template>
  <div class="row">
    <div class="col">
      <q-input
        :rules="props.field.ValidationRules"
        :label="props.field.Label"
        :placeholder="props.field.Placeholder"
        :model-value="props.entity[props.field.Name] as string"
        :autofocus="props.field.Autofocus"
        :clearable="props.field.Clearable"
        :hint="props.field.Help"
        @update:modelValue="onUpdate($event)"
        debounce="1000"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';
import { ref } from 'vue';


const props = defineProps<{
  field: EntityField;
  entity: GqlRecord;
  readonly: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const validation = ref(props.field.ValidationRules);

function onUpdate(value: string) {
  emit('update:modelValue', value);
}
</script>
