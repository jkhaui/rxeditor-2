import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ScrollbarContext } from 'react-scrollbars-custom';
import { useObservable, useSubscription } from 'observable-hooks';
import { fromEvent, Observable } from 'rxjs';

import { RXEDITOR_CONTEXTMENU } from '../RxEditor/utils/constants';

import { RxEditorContextMenu } from '../ContextMenu/ContextMenu';
import RxEditorContainer from '../RxEditor';
import SideDrawer from '../SideDrawer/SideDrawer';
import TopPanel from '../TopPanel/TopPanel';
import { getCaretCoordinates } from '../../utils/utils';
import RxEditorContext from '../../contexts/RxEditorContext';

export default () => {
  const scrollbarContext = useContext(ScrollbarContext);
  const editorStore = useContext(RxEditorContext);

  const {
    scrollState,
    editorState,
  } = editorStore;
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
      scrollbarContext.parentScrollbar!.scrollTop += 135;
    }

    // Contenteditable has weird bugs which cause the page layout to shift
    // and break when `PageUp` or `PageDown` are pressed, so we completely
    // disable these keys and rewrite their functionality.
    const scrollbar = document.querySelector('.ScrollbarsCustom-ThumbY');
    const hasFocus = editorState.current.getSelection().getHasFocus();

    if (scrollbar && !scrollState.locked) {
      if (key === 'ArrowUp' && !hasFocus) {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop -= 100;
      }
      if (key === 'PageUp') {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop -= 270;
      }
      if (key === 'PageDown' || (key === ' ' && !hasFocus)) {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop += 270;
      }
      if (key === 'ArrowDown' && !hasFocus) {
        e.preventDefault();
        e.stopPropagation();
        scrollbarContext.parentScrollbar!.scrollTop += 100;
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

  return (
    <Fragment>
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
    </Fragment>
  );
}
