/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router as vueRouter } from 'vue-router';
import User from './user';

export default interface QiksarAuthWrapper {

    Init(userStore:any):Promise<void>;
    GetAuthToken():string;
    Login(route:string):void;
    Logout():void;
    IsAuthenticated():boolean;
    HasRealmRole(role:string):boolean;
    GetUserRoles():string[];
    SetupRouterGuards(router: vueRouter):void;
    User:User;
  }