/* eslint-disable @typescript-eslint/no-unused-vars */

<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="column">
      <label>
        <b>{{ props.field.Label }}</b>
      </label>
      <q-avatar size="150px" class="q-mt-lg q-mb-lg">
        <img :src="state.imagePreview" />
      </q-avatar>
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
        :model-value="props.entity[props.field.Name]"
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
import { GqlRecord } from '../base/GqlTypes';

const defaultPreview = 'https://via.placeholder.com/300x300';

const props = defineProps<{
  field: EntityField;
  entity: GqlRecord;
}>();

const state = ref({
  imageFile: null,
  imagePreview: props.entity[props.field.Name] || defaultPreview,
  originalPreview: props.entity[props.field.Name] || defaultPreview,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onUpdate(value: string) {
  if (!value) return;

  emit('update:modelValue', value);
}

function onChange() {
  const file = state.value.imageFile;
  new Compressor(file, {
    quality: 0.6,
    success(compressedFile) {
      try {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          (event: ProgressEvent) => {
            const target: FileReader = event.target;
            state.value.imagePreview = target.result;

            // Call update model value
            emit('update:modelValue', target.result);
          },
          false
        );
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        throw new Error(error);
      }
    },
    error(err) {
      console.log(err.message);
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
