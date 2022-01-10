/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import getEntityRoutes from './getEntityRoutes';
import InitialiseDomain from 'src/domain/InitialiseDomain';

export default async function getRoutes(): Promise<RouteRecordRaw[]>  
{ 
  // Build the schemas and view first...
	await InitialiseDomain();

  //
  const domainRoutes = getEntityRoutes();

  return [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue'), meta: { anonymous: true } },
      ],
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

    // Always leave this as last one,
    // but you can also remove it
    {
      meta: { anonymous: true },
      path: '/:catchAll(.*)*',
      component: () => import('pages/Error404.vue'),
    },

    ...domainRoutes
    ] 
}