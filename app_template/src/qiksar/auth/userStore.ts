import { defineStore } from 'pinia'
import User from './user';

/**
 * Provide a store to manage the state of the user profile
 */
const useUserStore = defineStore('user', {
  /**
   * Shared user profile state
   * @returns state object
   */
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
    /**
     * Set the user profile
     * @param user New user profile
     */
    setUser(user: User) { this.user = user; },
    
    /**
     * Set the authenticated state
     * @param loggedIn True = Logged in, else logged out
     */
    setLoggedIn(loggedIn: boolean){
      this.loggedIn = loggedIn;
    }
  },
});

export default useUserStore;