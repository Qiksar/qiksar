<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">You are not authorized</div>

      <div class="text-h2" style="opacity: 0.4">
        Your user account does not have the correct permissions required to
        access this page. Please contact your system administator if you require
        assistance.
      </div>

      <q-btn
        to="/"
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="Home Page"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageUnauthorized',
});
</script>
