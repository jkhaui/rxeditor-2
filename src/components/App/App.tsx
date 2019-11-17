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
import { getCaretCoordinates } from '../../utils/utils';

// @ts-ignore
import visbyCf from '../../assets/fonts/VisbyCF-Regular.woff';
// @ts-ignore
import visbyCfBold from '../../assets/fonts/VisbyCF-Bold.woff';
// import caboLight from '../../extensions/themes/caboLight.json';
// import chelevra from '../../extensions/themes/chelevra.json';

import { IThemeProps } from '../../types/ui';

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

export default () => {
  const themeStore = useContext(ThemeContext);
  const scrollbarContext = useContext(ScrollbarContext);
  const editorStore = useContext(RxEditorContext);

  const {
    scrollState,
    editorState,
  } = editorStore;

  const appWrapperRef = useRef<HTMLDivElement>(null);

  // https://github.com/microsoft/TypeScript/issues/33047
  const keydown$: Observable<any> = useObservable(
    () => fromEvent(document, 'keydown'),
  );

  // Here we re-wire the behavior of certain keys/key combos so they don't
  // interfere with custom keyboard shortcuts lower down the component tree.
  useSubscription(keydown$, (e: React.KeyboardEvent<HTMLDocument>) => {
    const { key, ctrlKey, shiftKey } = e;
    const isCaretOutsideViewport =
      getCaretCoordinates(window).isCaretOutsideViewport;

    if (isCaretOutsideViewport) {
      scrollbarContext.parentScrollbar!.scrollTop += 270;
    }

    // Contenteditable has weird bugs which cause the page layout to shift
    // and break when `PageUp` or `PageDown` are pressed, so we completely
    // disable these keys and rewrite their functionality.
    const scrollbar = document.querySelector('.ScrollbarsCustom-ThumbY');
    if (scrollbar && !scrollState.locked) {
      if (key === 'PageUp') {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop -= 270;
      }
      if (
        key === 'PageDown' ||
        (key === ' ' && editorState.current.getSelection().getHasFocus())
      ) {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop += 270;
      }
    }

    // Default HotKeys shortcuts.
    if (ctrlKey) {
      if (key === 'k' || key === 'd' || key === 'o') {
        e.preventDefault();
      }
      if (shiftKey && key === 'p') {
        e.preventDefault();
      }
    }
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

  return (
    <ThemeProvider
      theme={{
        active: themeStore.currentTheme,
      }}
    >
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
