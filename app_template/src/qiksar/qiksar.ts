import { Router as vueRouter } from 'vue-router';

import QiksarAuthWrapper from 'src/qiksar/auth/QiksarAuthWrapper';
import QiksarKeycloakWrapper from './auth/QiksarKeycloakWrapper';

export default class Qiksar {
  // Set the auth wrapper to an instance of the Qiksar Keycloak wrapper
  static authWrapper: QiksarAuthWrapper = new QiksarKeycloakWrapper();
  static router: vueRouter;

  static get AuthWrapper(): QiksarAuthWrapper {
    return Qiksar.authWrapper;
  }

  static get Router(): vueRouter {
    return Qiksar.router;
  }

  static async Boot(router: vueRouter): Promise<void> {
    Qiksar.router = router;
    await Qiksar.AuthWrapper.Init(router);
  }
}
