<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 10vh">
        Logged Out
      </div>

      <q-btn
        to="/members"
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="Login"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AuthWrapper } from 'src/boot/auth';

export default {
  name: 'PageLoggedOut',
  beforeCreate() {
    void AuthWrapper.Logout();
  },
  setup(){
    return {
    }
  }
}
</script>