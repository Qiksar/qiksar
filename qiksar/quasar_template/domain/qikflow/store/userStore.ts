import { defineStore } from 'pinia'
import User from './types/user';


// main is the name of the store. It is unique across your application
// and will appear in devtools
const useUserStore = defineStore('user', {
  // a function that returns a fresh state
  state: () => {
      return {
        loggedIn: false,
        user:<User>{}
     }
  },
  // optional getters
  getters: {
  },
  // optional actions
  actions: {
    setUser(user: User) { this.user = user; },
    setLoggedIn(loggedIn: boolean){
      this.loggedIn = loggedIn;
    }
  },
});

export default useUserStore;