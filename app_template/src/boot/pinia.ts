/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import useUserStore from 'src/qiksar/auth/userStore';

const pinia = createPinia();
export let userStore = {} as any;

//----------------------------------------------------------------------------------------------------------------
//
// BOOT - Pinia
//
// Make Pinia available to the app and create the UserStore, which helps the app share data about 
// the authenticated user
//

export default boot(({ app }) => {
  app.use(pinia);
  userStore = useUserStore()
});
