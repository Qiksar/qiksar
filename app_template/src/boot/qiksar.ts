/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { boot } from 'quasar/wrappers';
import { Router } from 'src/router';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

import QiksarAuthWrapper from 'src/qiksar/auth/QiksarAuthWrapper';
import QiksarKeycloakWrapper from 'src/qiksar/auth/QiksarKeycloakWrapper';

// Set the auth wrapper to an instance of the Qiksar Keycloak wrapper
export const AuthWrapper: QiksarAuthWrapper = new QiksarKeycloakWrapper();

//----------------------------------------------------------------------------------------------------------------
//
// BOOT - Auth
//
// Initialise the authentication and authorisation system. This should not trigger a log in as they user
// may start on a landing page that does not require authentication.
//
// Tt is assumed that Quasar has initialised the global Router instance by running createRouter from src/router/index.ts
//
export default boot(async ({ app }) => {
  app.use(createPinia());
  app.use(VueApexCharts);

  await AuthWrapper.Init(Router);
});
