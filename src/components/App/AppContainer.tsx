import React, { useContext, useRef, useState } from 'react';
import 'symbol-observable';
import { useObserver } from 'mobx-react-lite';
import { ApolloProvider } from '@apollo/react-hooks';
import Scrollbar from 'react-scrollbars-custom';
import { configure } from 'react-hotkeys';
import { defer, fromEvent, merge, Observable } from 'rxjs';
import { useObservable, useSubscription } from 'observable-hooks';
import { first, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import {
  ACTIVE_THEME,
  CABO_LIGHT_THEME,
  CHELEVRA_THEME,
  VISBY_BOLD,
  VISBY_REGULAR,
  // CHELEVRA_THEME,
} from '../../utils/constants';
import { RXEDITOR_SCROLLBAR } from '../RxEditor/utils/constants';

import App from './App';
import { client } from '../../graphql/apollo';
import LoginContainer from '../Login/LoginContainer';
import { StyledContainer } from '../common/StyledComponents';
import ThemeContext, { ThemeContextProvider } from '../../contexts/ThemeContext';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import { CoreThemes, ExtraThemes, IThemeProps } from '../../types/ui';

import caboLight from '../../extensions/themes/caboLight.json';
import chelevra from '../../extensions/themes/chelevra.json';
// @ts-ignore
import visbyCf from '../../assets/fonts/VisbyCF-Regular.woff';
// @ts-ignore
import visbyCfBold from '../../assets/fonts/VisbyCF-Bold.woff';
import 'antd/dist/antd.css';
import './AppContainer.css';

const clientHeight = document.body.clientHeight;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: ${VISBY_REGULAR};
    src: url(${visbyCf}) format('woff');
  }
  @font-face {
    font-family: ${VISBY_BOLD};
    src: url(${visbyCfBold}) format('woff');
  }
  
  body {
    font-family: ${VISBY_REGULAR};
    overflow: hidden;
  }
`;

const AppWrapper = styled.div`
  color: ${({ theme }: IThemeProps) =>
  theme.active === CHELEVRA_THEME
    ? '#F5F1F2'
    : '#323332'};
  background: ${({ theme }: IThemeProps) =>
  theme.active === CHELEVRA_THEME
    ? '#2B303B'
    : '#DADADA'};
  margin: 0;
  padding: 0;
`;

const StyledScrollbarWrapper: any = styled(StyledContainer)`
  //background-color: #FFF;
`;

export default () => {
  const themeStore = useContext(ThemeContext);
  const authStore = useContext(AuthenticationContext);

  const [currentTheme, setCurrentTheme] = useState(CABO_LIGHT_THEME);

  const appWrapperRef = useRef<HTMLDivElement>(null);

  const themes = [caboLight, chelevra];
  const themeNames = themes.map(theme => theme.name);
  console.log(themeNames);

  const toggleTheme = (selectedTheme: CoreThemes | ExtraThemes): void => {
    if (currentTheme !== selectedTheme) {
      setCurrentTheme(selectedTheme);
      localStorage.setItem(ACTIVE_THEME, selectedTheme);
    }
  };

  const themeStoreContext = {
    currentTheme,
    toggleTheme,
  };

  // Lets `react-hotkeys` work when the editor is focused.
  configure({
    ignoreTags: [],
    ignoreEventsCondition: () => false,
  });

  // Handle drag and drop events.
  const dragEnter$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragenter'),
    ).pipe(
      tap(() => appWrapperRef.current!.style.opacity = '.5'),
    ),
  );

  const dragLeave$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragleave'),
    ).pipe(
      tap(() => appWrapperRef.current!.style.opacity = '1'),
    ),
  );

  const dragEnd$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragend'),
    ).pipe(
      tap(() => appWrapperRef.current!.style.opacity = '1'),
    ),
  );

  const dragOver$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragover'),
    ).pipe(
      tap(e => e.preventDefault()),
    ),
  );

  const drop$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'drop'),
    ).pipe(
      tap(e => {
        e.preventDefault();
        appWrapperRef.current!.style.opacity = '1';
        // console.log(e.dataTransfer.files[0].name);
      }),
    ),
  );

  const dragAndDrop$: Observable<any> = useObservable(
    () => dragEnter$.pipe(
      mergeMap(() => dragOver$),
      switchMap(() => merge(
        dragLeave$.pipe(
          first(),
        ),
        drop$.pipe(
          takeUntil(dragEnd$),
        ),
      )),
    ),
  );

  useSubscription(dragAndDrop$);

  return useObserver(() =>
    <ApolloProvider client={client}>
      <ThemeProvider
        theme={{
          active: themeStore.currentTheme,
        }}
      >
        <AppWrapper ref={appWrapperRef}>
          <GlobalStyle />
          {
            authStore.token !== null || authStore.guestMode
              ? <Scrollbar
                noScrollX={true}
                createContext={true}
                trackYProps={{
                  renderer: props => {
                    const { elementRef, ...rest } = props;
                    return <StyledScrollbarWrapper
                      ref={elementRef}
                      className={RXEDITOR_SCROLLBAR}
                      onContextMenu={(e: Event) => e.preventDefault()}
                      {...rest}
                    />;
                  },
                }}
                style={{
                  height: clientHeight,
                }}
              >
                <ThemeContextProvider value={themeStoreContext}>
                  <App />
                </ThemeContextProvider>
              </Scrollbar>
              : <LoginContainer />
          }
        </AppWrapper>
      </ThemeProvider>
    </ApolloProvider>,
  );
};
