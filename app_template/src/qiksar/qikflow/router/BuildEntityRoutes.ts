/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import EntityDefinition from 'src/qiksar/qikflow/base/EntityDefinition';

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
): RouteRecordRaw[] {
  return [
    {
      component: () => import('src/qiksar/qikflow/ui/EntityList.vue'),
      meta: { role: requiredRole },
      path: `/${entityName}`,
      props: { entity_type: entityName },
    },
    {
      component: () => import('src/qiksar/qikflow/ui/EntityEdit.vue'),
      meta: { role: requiredRole },
      path: `/${entityName}/edit/:id`,
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
  ];
}

/**
 * Build the VUE Router paths for each dynamic entity to enable list, view and edit
 *
 * @returns Return
 */
export default function BuildEntityRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  EntityDefinition.Entities.map((s: EntityDefinition) => {
    getRoutesForEntity(s.EntityName, 'tenant_admin').map((r) => routes.push(r));
  });

  return routes;
}
