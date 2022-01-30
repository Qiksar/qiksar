import { Dictionary } from './../qiksar/qikflow/base/GqlTypes';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import EntitySchema from '../qiksar/qikflow/base/EntitySchema';

/**
 * This method generates a set of routes for viewing and editing a specific entity
 *
 * @param entityName Name of the entity
 * @param requiredRole Role required to access the route
 * @returns Route record comprising the path to the view and edit pages
 */
function getRoutesForEntity(
  entityName: string,
  requiredRole: string
): RouteRecordRaw {
  return {
    path: `/${entityName}`,

    component: () => import('src/layouts/MainLayout.vue'),

    meta: { role: requiredRole },

    children: [
      {
        path: '',
        component: () => import('src/qiksar/qikflow/ui/EntityList.vue'),
        props: { entity_type: entityName },
      },
      {
        path: 'edit/:id',
        component: () => import('src/qiksar/qikflow/ui/EntityEdit.vue'),
        props: (route: any) => {
          const props = {
            context: {
              entity_type: entityName,
              entity_id: route.params.id as string,
              real_time: true,
            },
          };

          return props;
        },
      },
    ],
  };
}

/**
 *
 * @returns Return
 */
export default function getEntityRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  EntitySchema.Schemas.map((s: EntitySchema) => {
    routes.push(getRoutesForEntity(s.EntityName, 'tenant_admin'));
  });

  return routes;
}
