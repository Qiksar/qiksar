<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-3" v-for="i in 4" :key="i">
      <q-skeleton
        class="full-width"
        height="140px"
        style="background: #343e59"
      />
    </div>
    <div class="col-md-6 col-sm-12 col-xs-12" v-for="item in 6" :key="item">
      <q-skeleton
        class="full-width"
        height="230px"
        style="background: #343e59"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'CardSkeleton',
  components: {},
  data() {
    return {};
  },
});
</script>
