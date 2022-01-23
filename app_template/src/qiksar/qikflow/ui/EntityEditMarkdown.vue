<template>
  <div class="q-markdown-input">
    <div class="row">
      <label class="q-mb-md">
        {{ props.field.Label }}
      </label>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="q-markdown-input__field full-height">
          <div class="q-markdown-input__header justify-between">
            <span class="text-uppercase">Markdown</span>
            <div class="q-markdown-input__block-dropdown row items-center">
              <label class="q-mr-md">Insert block</label>
              <q-select
                outlined
                v-model="state.block"
                :options="blocks"
                dense
                @update:modelValue="onSelectBlock"
              />
            </div>
          </div>
          <q-input
            :model-value="props.entity[props.field.Name] as string"
            @update:modelValue="onUpdate($event)"
            ref="markdownField"
            type="textarea"
            placeholder="Enter your markdown here"
            class="full-height overflow-auto"
            debounce="1000"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="q-markdown-input__preview overflow-auto">
          <div class="q-markdown-input__header">
            <span class="text-uppercase">Preview</span>
          </div>
          <q-markdown
            :src="props.entity[props.field.Name] as string"
            class="full-height overflow-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EntityField from '../base/EntityField';
import { GqlRecord } from '../base/GqlTypes';

type TMarkdownBlock = {
  label: string;
  value: string;
};

interface IProxy {
  focus: () => void,
};

const props = defineProps<{
  field: EntityField;
  entity: GqlRecord;
  update_mode: boolean;
}>();

const state = ref({
  block: '',
});
const markdownField = ref(null);

const blocks: Array<TMarkdownBlock> = [
  {
    label: 'BLOCK 1',
    value: '{{ BLOCK_1 }}',
  },
  {
    label: 'BLOCK 2',
    value: '{{ BLOCK_2 }}',
  },
  {
    label: 'BLOCK 3',
    value: '{{ BLOCK_3 }}',
  },
];

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onUpdate(value: string) {
  if (!value) return;

  emit('update:modelValue', value);
}

function onSelectBlock() {
  const block: TMarkdownBlock = state.value.block;
  insertBlock(block.value);
  state.value.block = '';
}

function insertBlock(block: string) {
  const currentMarkdown: string = props.entity[props.field.Name];
  const refProxy: IProxy = markdownField.value;
  const textareaWrapperEl = refProxy.$el as HTMLElement;
  const textareaEl = textareaWrapperEl.querySelector('textarea');
  const selectionStart = textareaEl.selectionStart;
  const selectionEnd = textareaEl.selectionEnd;
  const textBefore: string = currentMarkdown.substring(0, selectionStart);
  const textAfter: string = currentMarkdown.substring(selectionEnd, currentMarkdown.length);
  const newMarkdown = `${textBefore}${block}${textAfter}`;

  // Call update
  onUpdate(newMarkdown);

  textareaEl.selectionEnd = selectionEnd + block.length;
  refProxy.focus();
}
</script>
