/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import getEntityRoutes from './GetEntityRoutes';
import InitialiseDomain from './InitialiseDomain';

/**
 * A critical function in the app startup process which returns the routes for pages, blended with automatically generated routes for the data view/edit screens.
 * 
 * @returns List of route records
 */
export default async function getRoutes(): Promise<RouteRecordRaw[]>
{ 
  // Pre-load all the views for the domain
	await InitialiseDomain(
    [
    'TenantsView', 
    'LocalesView', 
    'RolesView', 
    'StatusView', 
    'GroupsView', 
    'MembersView'
    ]);

  const generatedRoutes = getEntityRoutes();

  // At this point the generatedRoutes can be further manipulated to add routes from other generators

  // Add static routes here...
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

    ...generatedRoutes
    ] 
}