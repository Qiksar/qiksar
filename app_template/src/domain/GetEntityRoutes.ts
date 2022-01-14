/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router';
import EntitySchema from '../qiksar/qikflow/base/EntitySchema';

function getRoutesForEntity(entityName: string, requiredRole: string) {
	return 	{
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
	}
}

// Todo the member role is hard code and should be defined elsewhere
export default function getEntityRoutes(): RouteRecordRaw[] {
	const routes: RouteRecordRaw[] = [];
	
	EntitySchema.Schemas.map((s: EntitySchema) => {
		routes.push(getRoutesForEntity(s.EntityType, 'tenant_admin'));
	});
	
	return routes;
}
