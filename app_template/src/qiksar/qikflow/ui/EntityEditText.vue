// https://quasar.dev/vue-components/input

<template>
  <div class="row">
    <div class="col">
      <q-input
        :rules="props.field.ValidationRules"
        :label="props.field.Label"
        :placeholder="props.field.Placeholder"
        :model-value="props.formContext.Root.CurrentRecord[props.field.Name] as string"
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
import FormContext from '../forms/FormContext';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onUpdate(value: string | number | null) {
  if (value)
    emit('update:modelValue', value.toString());
}
</script>
