import { createContext } from 'react';

import { authenticationStore } from '../stores/AuthenticationStore';

const AuthenticationContext = createContext(authenticationStore);

export default AuthenticationContext;
