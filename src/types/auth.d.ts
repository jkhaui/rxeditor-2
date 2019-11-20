export interface IAuthResult {
  data: {
    login: {
      authToken: string | void
    }
  }
}

export interface IAuthState {
  token: string | null;
  guestMode: boolean
}