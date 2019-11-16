export type CoreThemes = 'CHELEVRA_THEME' | 'CABO_LIGHT_THEME' | 'SOLARIZED_THEME';

export type ExtraThemes = 'SOLARIZED_THEME';

export interface IThemeProps {
  theme: {
    active: CoreThemes | ExtraThemes;
  }
}
