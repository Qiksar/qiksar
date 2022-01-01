import {
	Router as vueRouter,
	createMemoryHistory,
	createRouter as vueCreateRouter,
	createWebHashHistory,
	createWebHistory,
} from 'vue-router';

import { AuthWrapper } from 'boot/keycloak';
import { CreateApolloClient } from 'src/apollo';
import InitialiseDomain from 'src/domain/init_domain';
import Query from 'src/domain/qikflow/base/Query';
import EntitySchema from 'src/domain/qikflow/base/EntitySchema';
import mainRoutes from 'src/router/routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
	? createMemoryHistory
	: process.env.VUE_ROUTER_MODE === 'history'
	? createWebHistory
	: createWebHashHistory;

export let Router = {} as vueRouter;

const createRouter = async(): Promise<vueRouter> => {
	
	// create the apollo client, which creates TypePolicies according to the views registered above
	Query.Apollo = CreateApolloClient();	

	await InitialiseDomain('./views/');
	EntitySchema.ResolveReferences();
	
	//console.log('domain init complete')

	let r = {} as vueRouter;
	const routes = mainRoutes();

	r = vueCreateRouter({
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,

		// Leave this as is and make changes in quasar.conf.js instead!
		// quasar.conf.js -> build -> vueRouterMode
		// quasar.conf.js -> build -> publicPath
		history: createHistory(
			process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
		),
	});

	r.beforeEach((to, from, next) => {
		const required_role: string = <string>to.meta.role ?? 'unauthorized';
		const allow_anonymous: boolean = <boolean>to.meta.anonymous ?? false;

		if (allow_anonymous) {
			// Page doesn't require auth
			next();
		} else if (!AuthWrapper.IsAuthenticated()) {
			// User must be logged in
			AuthWrapper.Login(to.path);
		} else if (AuthWrapper.HasRealmRole(required_role)) {
			// User must have at least the default role
			next();
		} else {
			next({ path: '/unauthorized' });
		}
	});

	Router = r;

	return r;
};

export default createRouter;
