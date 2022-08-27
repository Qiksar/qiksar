<template>
  <div v-if="context.Root.HasRecord && !context.Root.IsBusy">
    <div v-for="(field, key) in context.EditableFields()" v-bind:key="key" class="row">
      <div class="col">
        <component
          :is="QiksarFieldEditors[field.Editor]"
          :formContext="context"
          :field="field"
          :readonly="ReadOnly(field)"
          @update:modelValue="realtimeUpdate(field, $event)"
        />
      </div>
    </div>
  </div>

  <div class="row">
    <q-btn
      v-if="!context.RootRecordId"
      @click="insertEntity()"
      class="q-mt-xl"
      label="Save"
    />
    <q-btn
      v-if="context.RootRecordId"
      @click="deleteEntity()"
      class="q-mt-xl"
      label="Delete"
    />
    <q-btn to="/" class="q-mt-xl" label="Home" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import EntityField from "../base/EntityField";
import FormContext from "../forms/FormContext";
import QiksarFieldEditors from "./QiksarFieldEditors";

const props = defineProps<{
  context: {
    entity_id: string;
    entity_type: string;
    real_time: { type: boolean; default: false };
  };
}>();

// Start with an empty record
const current_record = ref({});

// Indicates if a record is being inserted or updated
const UpdateMode = ref(false);

function ReadOnly(field: EntityField): boolean {
  return (UpdateMode.value && field.IsWriteOnce) || field.IsReadonly;
}

// Create a context for the form, where the top level entity is the root, and any related entities (through many to many joins) can get line of sight to the parent.
// This way, tags on a blog article can get the id of the article, and can be filtered according to the article id, from the many to many join (article_tags)
const context = new FormContext();
void context.Initialise(props.context.entity_type, props.context.entity_id).then((r) => {
  current_record.value = r;
});

//#region CRUD wrappers

// These methods help to make the template code cleaner by wrapping access to the form context

async function insertEntity(): Promise<void> {
  current_record.value = await context.Add(current_record.value);
  UpdateMode.value = true;
}

async function realtimeUpdate(
  field: EntityField,
  value: string | number | undefined
): Promise<void> {
  if (props.context.real_time)
    current_record.value = await context.Update(field.Name, value);
}

function deleteEntity() {
  void context.Delete();
}

//#endregion
</script>
