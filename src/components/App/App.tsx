import React, { useRef, useContext } from 'react';
import { Col, Row } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ScrollbarContext } from 'react-scrollbars-custom';
import {
  defer,
  fromEvent,
  merge,
  Observable,
} from 'rxjs';
import {
  first,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useObservable, useSubscription } from 'observable-hooks';

import {
  CHELEVRA_THEME,
  VISBY_BOLD,
  VISBY_REGULAR,
} from '../../utils/constants';

import RxEditorContext from '../../stores/RxEditorContext';
import ThemeContext from '../../stores/ThemeContext';
import { RxEditorContextMenu } from '../ContextMenu/ContextMenu';
import RxEditorContainer from '../RxEditor';
import { RXEDITOR_CONTEXTMENU } from '../RxEditor/utils/constants';
import SideDrawer from '../SideDrawer/SideDrawer';
import TopPanel from '../TopPanel/TopPanel';

// @ts-ignore
import visbyCf from '../../assets/fonts/VisbyCF-Regular.woff';
// @ts-ignore
import visbyCfBold from '../../assets/fonts/VisbyCF-Bold.woff';

import { IThemeProps } from '../../types/ui';
import gear from '../../assets/icons/gear.svg';

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
  color: ${(props: IThemeProps) => (
  props.theme.active === CHELEVRA_THEME
    ? '#F5F1F2'
    : '#323332'
)};
  background: ${(props: IThemeProps) => (
  props.theme.active === CHELEVRA_THEME
    ? '#2B303B'
    : '#DADADA'
)};
  margin: 0;
  padding: 0;
`;

export default () => {
  const themeContext = useContext(ThemeContext);
  const scrollbarContext = useContext(ScrollbarContext);
  const editorContext = useContext(RxEditorContext);

  const { scrollState } = editorContext;

  const appWrapperRef = useRef<any>(null);

  // https://github.com/microsoft/TypeScript/issues/33047
  const keydown$: Observable<any> = useObservable(
    () => fromEvent(document, 'keydown',
    ),
  );

  // Here we re-wire the behavior of certain keys/key combos so they don't
  // interfere with custom keyboard shortcuts lower down the component tree.
  useSubscription(keydown$, (e: React.KeyboardEvent<HTMLDocument>): void => {
    const { key, ctrlKey, shiftKey } = e;
    if (key === 'PageUp' || key === 'PageDown') {
      e.preventDefault();
      e.stopPropagation();
      const scrollbar = document.querySelector('.ScrollbarsCustom-ThumbY');
      if (scrollbar && !scrollState.locked) {
        if (key === 'PageUp') {
          scrollbarContext.parentScrollbar!.scrollTop -= 270;
        }
        if (key === 'PageDown') {
          scrollbarContext.parentScrollbar!.scrollTop += 270;
        }
      }
    }

    if (ctrlKey) {
      if (key === 'k' || key === 'd' || key === 'o') {
        e.preventDefault();
      }
      if (shiftKey && key === 'p') {
        e.preventDefault();
      }
    }
  });

  const dragEnter$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragenter'),
    ).pipe(
      tap(() => appWrapperRef.current.style.opacity = .5),
    ),
  );

  const dragLeave$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragleave'),
    ).pipe(
      tap(() => appWrapperRef.current.style.opacity = 1),
    ),
  );

  const dragEnd$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragend'),
    ).pipe(
      tap(() => appWrapperRef.current.style.opacity = 1),
    ),
  );

  const dragOver$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'dragover'),
    ).pipe(
      tap((e: Event) => e.preventDefault()),
    ),
  );

  const drop$: Observable<any> = useObservable(
    () => defer(
      () => fromEvent(document, 'drop'),
    ).pipe(
      tap((e: any) => {
        e.preventDefault();
        appWrapperRef.current.style.opacity = 1;
        console.log(e.dataTransfer.files[0].name);
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

  return (
    <ThemeProvider
      theme={{
        active: themeContext.currentTheme,
        fontFamily: VISBY_REGULAR,
      }}>
      <AppWrapper ref={appWrapperRef}>
        <GlobalStyle />
        <RxEditorContextMenu />
        <ContextMenuTrigger
          id={RXEDITOR_CONTEXTMENU}
          holdToDisplay={-1}
        >
          <TopPanel />
          <Row>
            <Col span={7} />
            <Col span={17}>
              <RxEditorContainer
                disableDoubleSpaces={true}
                enforceEmDash={true}
              />
            </Col>
          </Row>
        </ContextMenuTrigger>
        <SideDrawer />
      </AppWrapper>
    </ThemeProvider>
  );
};
