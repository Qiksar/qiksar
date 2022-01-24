/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  focus: () => void;
  $el: HTMLElement;
};

const props = defineProps<{
  field: EntityField,
  entity: GqlRecord,
  readonly: boolean
}>();

const state = ref({
  block: '',
});

const markdownField = ref(null);

const blocks: Array<TMarkdownBlock> = [
  {
    label: 'Governing Law AU',
    value: '{{ GOV_LAW_AU }}\r\n',
  },
  {
    label: 'Governing Law AU - WA',
    value: '{{ GOV_LAW_AU_WA }}\r\n',
  },
  {
    label: 'Governing Law AU - VIC',
    value: '{{ GOV_LAW_AU_VIC }}\r\n',
  },
  {
    label: 'ISO 27001 - Section 12c',
    value: '{{ ISO27001_S12 }}\r\n',
  },
  {
    label: '',
    value: '{{ BLOCK_3 }}\r\n',
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
  const text = state.value.block;
  insertBlock(text);
  state.value.block = '';
}

function insertBlock(block: string) {

  if(!markdownField.value)
    return;

  const refProxy = markdownField.value as IProxy;
  const textareaWrapperEl = refProxy.$el;
  const textareaEl = textareaWrapperEl.querySelector('textarea');

  if(!textareaEl)
      return;

  const selectionStart:number = textareaEl.selectionStart;
  const selectionEnd:number = textareaEl.selectionEnd;

  const currentMarkdown: string = props.entity[props.field.Name] as string;
  const textBefore: string = currentMarkdown.substring(0, selectionStart);
  const textAfter: string = currentMarkdown.substring(selectionEnd, currentMarkdown.length);
  const newMarkdown = `${textBefore}${block}${textAfter}`;

  // Call update
  onUpdate(newMarkdown);

  textareaEl.selectionEnd = selectionEnd + block.length;
  refProxy.focus();
}
</script>
