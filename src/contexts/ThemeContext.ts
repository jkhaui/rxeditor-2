import { createContext } from 'react';

import { DEFAULT_THEME } from '../utils/constants';

import { CoreThemes, ExtraThemes } from '../types/ui';

const ThemeContext = createContext({
  currentTheme: DEFAULT_THEME,
  toggleTheme: (selectedTheme: CoreThemes | ExtraThemes) => {
  },
});

export const ThemeContextProvider = ThemeContext.Provider;

export default ThemeContext;
