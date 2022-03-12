/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';
import Qiksar from 'src/qiksar/qiksar';
import { Router } from 'src/router';


export default boot(async ({ app }) => {
  app.use(createPinia());
  app.use(VueApexCharts);

  // All we need to do to boot Qiksar is pass in our router instance
  await Qiksar.Boot(Router);
});
