<template>
  <q-page class="row items-center justify-evenly">
    <h1>Your awesome app goes here</h1>
    <h2>Use the navigation bar to explore the admin functions</h2>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AuthWrapper } from 'src/boot/qiksar';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    return {
      logout: () => {
        void AuthWrapper.Logout();
      },
    };
  },
});
</script>
