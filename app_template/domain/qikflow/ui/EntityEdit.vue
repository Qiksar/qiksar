<template>
  <div v-if="store.RecordLoaded && !store.busy">
    <div class="row" v-for="(field, key) in editableFields()" v-bind:key="key">
      <div class="col">
        <component
          :is="components[field.Editor]"
          :field="field"
          :entity="reactive_record"
          @update:modelValue="updateEntity(field, $event)"
        />
      </div>
    </div>
  </div>

  <div class="row">
    <q-btn v-if="!currentRecordId()" @click="insertEntity()" class="q-mt-xl" label="Save" />
    <q-btn v-if="currentRecordId()" @click="deleteEntity()" class="q-mt-xl" label="Delete" />
    <q-btn to="/" class="q-mt-xl" label="Home" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, Ref } from 'vue';
import { CreateStore } from 'src/domain/qikflow/store/GenericStore';
import { Dictionary, GqlRecord } from '../base/Query';

import EntityField from '../base/EntityField';
import EntityEditText from './EntityEditText.vue';
import EntityEditLichert from './EntityEditLichert.vue';
import EntityEditSelect from './EntityEditSelect.vue';

const components = {
  EntityEditText,
  EntityEditLichert,
  EntityEditSelect
} as Dictionary

const props = defineProps<{
  context: {
    entity_id: string,
    entity_type: string,
    real_time: { type: boolean, default: false }
  }
}>();

// eslint-disable-next-line vue/no-setup-props-destructure
let id: string | undefined = props.context.entity_id;

// create store for the required view/schema
const RecordLoaded = ref(false);
const store = CreateStore(props.context.entity_type);

const reactive_record = ref({} as GqlRecord) as Ref<GqlRecord>;

function setReactiveRecord(entity: GqlRecord): void {
  reactive_record.value = entity;
  RecordLoaded.value = true;
}

// Fetch the entity to edit
onBeforeMount(async () => {
  if (id && id.length > 0 && id != 'new') {
    await store
      .fetchById(id, !store.view.IsEnum)
      .then(() => {
        setReactiveRecord(store.CurrentRecord);
      });
  } else {
    // prepare a new record for insert
    setReactiveRecord(store.NewRecord);
  }
});

// Get a collection of editable fields
function editableFields(): Record<string, EntityField> {
  return store.view.EditableFields as Record<string, EntityField>;
}

// Extract the ID of the current entity in the store
function currentRecordId(): number {
  return (reactive_record.value[store.view.Schema.Key] ?? 0) as number;
}

async function insertEntity(): Promise<void> {
  reactive_record.value = await store.add(reactive_record.value);
}

function updateEntity(field: EntityField, value: unknown): void {
  const original = { ...store.CurrentRecord };
  store.CurrentRecord[field.AffectedFieldName] = value;

  if (props.context.real_time && currentRecordId())
    void store.update(store.CurrentRecord, original)
}

function deleteEntity() {
  void store.delete((reactive_record.value[store.view.Schema.Key] as number).toString())
}

</script>