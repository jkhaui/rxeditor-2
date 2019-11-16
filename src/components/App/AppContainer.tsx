import React, { useState } from 'react';
import Scrollbar from 'react-scrollbars-custom';
import { configure } from 'react-hotkeys';
import styled from 'styled-components';
import 'symbol-observable';

import {
  ACTIVE_THEME, /*CHELEVRA_THEME,*/
  CABO_LIGHT_THEME,
} from '../../utils/constants';
import {
  RXEDITOR_SCROLLBAR,
} from '../RxEditor/utils/constants';

import App from './App';
import { ThemeContextProvider } from '../../stores/ThemeContext';

import { CoreThemes, ExtraThemes } from '../../types/ui';

import './AppContainer.css';

const StyledContainer: any = styled.div``;

const clientHeight = document.body.clientHeight;

const AppContainer = () => {
  const [currentTheme, setCurrentTheme] = useState(CABO_LIGHT_THEME);

  const toggleTheme = (selectedTheme: CoreThemes | ExtraThemes): void => {
    if (currentTheme !== selectedTheme) {
      setCurrentTheme(selectedTheme);
      localStorage.setItem(ACTIVE_THEME, selectedTheme);
    }
  };
  const themeStore = {
    currentTheme,
    toggleTheme,
  };

  configure({
    ignoreTags: [],
    // Lets `react-hotkeys` work when the editor is focused.
    ignoreEventsCondition: () => false,
  });

  return (
    <Scrollbar
      noScrollX={true}
      createContext={true}
      trackYProps={{
        renderer: props => {
          const { elementRef, ...restProps } = props;
          return <StyledContainer
            {...restProps}
            ref={elementRef}
            className={RXEDITOR_SCROLLBAR}
            onContextMenu={(e: any) => e.preventDefault()}
          />;
        },
      }}
      style={{
        height: clientHeight,
      }}
      // permanentTrackY={true}
      // translateContentSizesToHolder={true}
    >
      <ThemeContextProvider value={themeStore}>
        <App />
      </ThemeContextProvider>
    </Scrollbar>
  );
};

export default AppContainer;
