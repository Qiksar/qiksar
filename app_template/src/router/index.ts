import {
  Router as vueRouter,
  createMemoryHistory,
  createRouter as vueCreateRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import BuildAppRoutes from 'src/domain/BuildAppRoutes';

export let Router = {} as vueRouter;

export default function createRouter(): vueRouter {
  const routes =  BuildAppRoutes();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  Router = vueCreateRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  return Router;
}
