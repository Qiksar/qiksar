// https://vueflow.dev

<template>
  <div style="height: 500px">
    <p>iCore Flow</p>
    <VueFlow
      style="height: 1000"
      :nodes-connectable="true"
      :nodes="nodes"
      :edges="edges"
      :default-zoom="zoom"
      :snap-to-grid="true"
      :snap-grid="[50, 50]"
    >
      <MiniMap />
      <Controls />
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EntityField from '../base/EntityField';
import FormContext from '../forms/FormContext';
import { VueFlow, MiniMap, Controls } from '@braks/vue-flow';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onUpdate(value: string | number | null) {
  if (value) emit('update:modelValue', value.toString());
}

const zoom = ref(1.0);

const nodes = ref([
  { id: '1', type: 'input', label: 'Read PACS', position: { x: 100, y: 0 } },
  { id: '2', type: 'input', label: 'PI Match', position: { x: 100, y: 100 } },
  {
    id: '3',
    type: 'input',
    label: 'Approve PI Match',
    position: { x: 100, y: 200 },
  },
  {
    id: '4',
    type: 'input',
    label: 'De-Identify',
    position: { x: 100, y: 300 },
  },
  {
    id: '5',
    type: 'output',
    label: 'Store in AWS',
    position: { x: 100, y: 400 },
  },
  {
    id: '6',
    type: 'output',
    label: 'Update SEAL',
    position: { x: 100, y: 500 },
  },
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
]);
</script>
