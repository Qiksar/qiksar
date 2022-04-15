/* eslint-disable @typescript-eslint/no-unused-vars */

<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="column">
      <label>{{ props.field.Label }}</label>
      <q-img
        :src="(props.formContext.Root.CurrentRecord[props.field.Name] as string)"
        class="q-mt-lg q-mb-lg"
        style="height: 140px; max-width: 150px"
      />
      <q-file
        filled
        bottom-slots
        v-model="state.imageFile"
        label="Pick a photo"
        @update:modelValue="onChange()"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop="onRemove" class="cursor-pointer" />
        </template>
      </q-file>
      <q-input
        :model-value="(props.formContext.Root.CurrentRecord[props.field.Name] as string)"
        @update:modelValue="onUpdate($event)"
        class="hidden"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Compressor from 'compressorjs';
import EntityField from '../base/EntityField';
import FormContext from '../forms/FormContext';

const IMAGE_QUALITY = 0.6;
const defaultPreview = 'https://via.placeholder.com/300x300';

const props = defineProps<{
  formContext: FormContext;
  field: EntityField;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const preview =
  (props.formContext.Root.CurrentRecord[props.field.Name] as string) ||
  defaultPreview;

const state = ref({
  imageFile: null,
  imagePreview: preview,
  originalPreview: preview,
});

function onUpdate(value: string | number | null) {
  if (value === null) return;

  emit('update:modelValue', value);
}

function onChange() {
  const file = state.value.imageFile;

  if (!file) return;

  const on_read_complete = (event: ProgressEvent) => {
    const target = event.target as FileReader;
    state.value.imagePreview = target.result ? (target.result as string) : '';

    // Call update model value
    emit('update:modelValue', target.result as string);
  };

  new Compressor(file, {
    quality: IMAGE_QUALITY,
    success(compressedFile) {
      try {
        const reader = new FileReader();
        reader.addEventListener('load', on_read_complete, false);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        throw new Error(error as string);
      }
    },
    error(err) {
      throw err;
    },
  });
}

function onRemove() {
  state.value.imageFile = null;
  state.value.imagePreview = defaultPreview;

  // Update model value
  const value =
    state.value.originalPreview !== defaultPreview
      ? state.value.originalPreview
      : '';

  emit('update:modelValue', value);
}
</script>
