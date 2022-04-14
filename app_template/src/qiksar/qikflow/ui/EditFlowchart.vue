// https://vueflow.dev

<template>
  <div class="row">
    <template>
      <VueFlow v-model="elements" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EntityField from '../base/EntityField';
import FormContext from '../forms/FormContext';
import { VueFlow  } from '@braks/vue-flow'

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

const elements = ref([
  // Nodes
  // An input node, specified by using `type: 'input'`
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },

  // Default nodes, you can omit `type: 'default'`
  { id: '2', label: 'Node 2', position: { x: 100, y: 100 }, },
  { id: '3', label: 'Node 3', position: { x: 400, y: 100 } },

  // An output node, specified by using `type: 'output'`
  { id: '4', type: 'output', label: 'Node 4', position: { x: 400, y: 200 } },

  // Edges
  // Most basic edge, only consists of an id, source-id and target-id
  { id: 'e1-3', source: '1', target: '3' },

  // An animated edge
  { id: 'e1-2', source: '1', target: '2', animated: true },
])

</script>
