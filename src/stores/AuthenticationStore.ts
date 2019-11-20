import { observable, action } from 'mobx';

import { AUTH_TOKEN } from '../graphql/constants';

/**
 * Global store maintaining the authentication status of the current user.
 */
class AuthenticationStore {
  @observable token = localStorage.getItem(AUTH_TOKEN);
  @action refreshTokenFn = (data = { AUTH_TOKEN: null }) => {
    const token = data[AUTH_TOKEN];

    if (token) {
      localStorage.setItem(AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN);
    }

    this.token = data[AUTH_TOKEN];
  };

  // "Guess mode" is when an unauthenticated user clicks "try without an
  // account" from the login form.
  @observable guestMode = false;
  @action setGuestMode = (state: boolean) => this.guestMode = state;
}

const authenticationStore = new AuthenticationStore();

export { authenticationStore };
