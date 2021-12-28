<template>
  <div class="row">
    <div class="col">
      <span>{{ props.field.Label }}</span>
    </div>
  </div>

  <div class="row">
    <div v-for="index in 10" v-bind:key="index" class="col">
      <q-radio
        :label="index.toString()"
        :val="index.toString()"
        v-model="radio_value"
        debounce="300"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';
import { computed } from 'vue';

const props = defineProps<{
  field: EntityField,
  entity: GqlRecord
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

const radio_value = computed({
  get() {
    return (props.entity[props.field.Name] as number)?.toString() ?? '';
  },
  set(newValue: string) {
    emit('update:modelValue', parseInt(newValue, 10));
  }
})

</script>