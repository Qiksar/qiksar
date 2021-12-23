/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import useUserStore from 'src/domain/qikflow/store/userStore';

const pinia = createPinia();
export let userStore = {} as any;

export default boot(({ app }) => {
  app.use(pinia);
  userStore = useUserStore()
});
