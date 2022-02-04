/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import BuildEntityRoutes from '../qiksar/qikflow/router/BuildEntityRoutes';
import InitialiseDomain from './InitialiseDomain';

/**
 * A critical function in the app startup process which returns the routes for pages, blended with automatically generated routes for the data view/edit screens.
 *
 * @returns List of route records
 */
export default function BuildAppRoutes(): RouteRecordRaw[] {
  // Pre-load all the views for the domain
  InitialiseDomain();

  const dynamicRoutes = BuildEntityRoutes();

  // At this point the dynamicRoutes can be further manipulated to add routes from other generators, resort the items into a different order than the default sequence, etc.

  // Add static routes here...
  return [
    {
      path: '/',

      component: () => import('layouts/MainLayout.vue'),

      children: [
        ...dynamicRoutes,

        {
          path: '',
          component: () => import('pages/Index.vue'),
          meta: { anonymous: true },
        },

        {
          path: '/dashboard',
          component: () => import('pages/Dashboard.vue'),
          meta: { anonymous: true },
        },

        {
          meta: { anonymous: true },
          path: '/unauthorized',
          component: () => import('pages/Unauthorized.vue'),
        },

        {
          meta: { anonymous: true },
          path: '/logout',
          component: () => import('pages/LoggedOut.vue'),
        },
      ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      meta: { anonymous: true },
      path: '/:catchAll(.*)*',
      component: () => import('pages/Error404.vue'),
    },
  ];
}
