/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable
@typescript-eslint/no-unsafe-assignment */
<template>
  <div
    ref="qMarkdownInput"
    :class="
      fullscreen
        ? 'q-markdown-input q-markdown-input--fullscreen'
        : 'q-markdown-input'
    "
  >
    <div class="row">
      <label class="q-mb-md">{{ props.field.Label }}</label>
    </div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-markdown-input__field full-height">
          <div class="q-markdown-input__header justify-between">
            <span class="text-uppercase">Markdown</span>
            <div class="q-markdown-input__block-dropdown row items-center">
              <label class="q-mr-md">Insert block</label>
              <q-select
                :options="blocks"
                v-model="selectedBlock"
                @update:modelValue="onSelectBlock($event)"
                outlined
                dense
              />
            </div>
          </div>
          <q-input
            :model-value="decodeBlock()"
            @update:modelValue="onUpdate($event)"
            ref="markdownField"
            type="textarea"
            placeholder="Enter your markdown here"
            class="full-height overflow-auto"
            debounce="10000"
          />
        </div>
      </template>
      <template v-slot:after>
        <div class="q-markdown-input__preview overflow-hidden">
          <div class="q-markdown-input__header justify-between">
            <span class="text-uppercase">Preview</span>
            <q-btn
              color="primary"
              text-color="white"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              class="q-markdown-input__fullscreen"
              @click="toggleFullscreen"
            />
          </div>
          <q-markdown
            :plugins="markdownPlugins"
            :src="decodeBlock()"
            class="overflow-auto"
          />
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// TODO - Should we use this bversion: https://www.npmjs.com/package/@wekanteam/markdown-it-mermaid
// because is seems to be more up to date
import markdownItMermaid from '@datatraccorporation/markdown-it-mermaid';
import EntityField from '../base/EntityField';
import FormContext from '../forms/FormContext';

type TMarkdownBlock = {
  label: string;
  value: string;
};

interface IProxy {
  focus: () => void;
  $el: HTMLElement;
}

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly: boolean;
}>();

const splitterModel = ref(50);
const qMarkdownInput = ref(null);
const markdownField = ref(null);
const markdownPlugins = [markdownItMermaid];
const selectedBlock = ref('');
const fullscreen = ref(false);

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

function decodeBlock(): string {
  let text: string = (props.formContext.Root.CurrentRecord[props.field.Name] ??
    '') as string;

  text = text.replace(/\{\%0A\}/g, '\n');
  text = text.replace(/\{\%0D\}/g, '\r');
  text = text.replace(/\{\%09\}/g, '\t');
  text = text.replace(/\{\%SQ\}/g, "'");
  text = text.replace(/\{\%DQ\}/g, '"');

  return text;
}

function onUpdate(value: string | number | null) {
  if (!value || typeof value === 'number') return;

  let save = value.replace(/\'/g, '{%SQ}');
  save = save.replace(/\"/g, '{%DQ}');
  save = save.replace(/\t/g, '{%09}');
  save = save.replace(/\r/g, '{%0D}');
  save = save.replace(/\n/g, '{%0A}');

  emit('update:modelValue', save);
}

function onSelectBlock(e: TMarkdownBlock) {
  insertBlock(e.value);
  selectedBlock.value = '';
}

function insertBlock(block: string) {
  if (!markdownField.value) return;

  const refProxy = markdownField.value as IProxy;
  const textareaWrapperEl = refProxy.$el;
  const textareaEl = textareaWrapperEl.querySelector('textarea');

  if (!textareaEl) return;

  const selectionStart: number = textareaEl.selectionStart;
  const selectionEnd: number = textareaEl.selectionEnd;

  const currentMarkdown: string = decodeBlock();
  const textBefore: string = currentMarkdown.substring(0, selectionStart);
  const textAfter: string = currentMarkdown.substring(
    selectionEnd,
    currentMarkdown.length
  );
  const newMarkdown = `${textBefore}${block}${textAfter}`;

  // Call update
  onUpdate(newMarkdown);

  textareaEl.selectionEnd = selectionEnd + block.length;
  refProxy.focus();
}

function toggleFullscreen() {
  if (fullscreen.value) {
    setTimeout(() => {
      if (qMarkdownInput.value) {
        const refProxy = qMarkdownInput.value as HTMLElement;
        refProxy.scrollIntoView();
      }
    }, 100);
  }

  fullscreen.value = !fullscreen.value;
}
</script>
