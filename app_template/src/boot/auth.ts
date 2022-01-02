/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// This helped us understand how to provide claims to Hasura...
// https://github.com/janhapke/hasura-keycloak

import { boot } from 'quasar/wrappers';
import QiksarAuthWrapper from 'src/qiksar/auth/QiksarAuthWrapper';
import { QiksarKeycloakWrapper } from 'src/qiksar/auth/QiksarKeycloakWrapper';

export const AuthWrapper:QiksarAuthWrapper = new QiksarKeycloakWrapper();

// Trigger Keycloak initialisation
export default boot(async () => { 
  await AuthWrapper.Init();
  console.log('Qiksar auth boot complete');
 });