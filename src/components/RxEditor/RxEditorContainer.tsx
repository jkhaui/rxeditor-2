import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Map } from 'immutable';
import { observable, reaction } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import { useObservable, useSubscription } from 'observable-hooks';
import { from, fromEvent, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HotKeys } from 'react-hotkeys';

import {
  CREATE_FOOTNOTE_POINTER_ACTION,
  keyMap,
  dragEvents,
  keyExceptions,
  RX_EDITOR_PLACEHOLDER,
  UNSTYLED_ALT_BLOCK_TYPE,
  UNSTYLED_BLOCK_TYPE,
} from './utils/constants';

import FootnoteContext from '../../stores/FootnoteContext';
import ComponentsContext from '../../stores/ComponentsContext';
import RxEditorContext from '../../stores/RxEditorContext';

import { handleBeforeInput } from '../../core/handleBeforeInput';
import {
  handleDrop,
  handlePastedFiles,
  handlePastedText,
  keyBindingFn,
  rxTabHandler,
} from '../../core/eventHandlers';
import {
  inlineToolbarPlugin,
  linkPlugin,
  plugins,
} from './utils/initPlugins';
import { blockStyleFn, handleLineBlock } from '../../core/layout';
import { customDecorators } from './Entities/decorator';
import { createEntity } from '../../actions';

import RxEditor from './RxEditor';
import RxEditorPage from './RxEditorPage';
import RxLineBlock from './RxLineBlock';

import 'draft-js/dist/Draft.css';

import {
  IContentBlock,
  ILineBlock,
  IRxEditor,
} from '../../types/rxEditor';

interface IProps {
  readOnlyState?: boolean;
  disableDoubleSpaces?: boolean;
  enforceEmDash?: boolean;
  footnotes?: boolean;
}

export default (props: IProps) => {
  const editorStore = useContext(RxEditorContext);
  const footnoteStore = useContext(FootnoteContext);
  const componentsStore = useContext(ComponentsContext);
  const {
    editorState,
    editorState$,
    onBlur,
    onFocus,
    readOnlyState,
    dispatch,
    lockEditor,
    unlockEditor,
  } = editorStore;
  const {
    count,
  } = footnoteStore;
  const {
    toggleRightDrawerVisible,
    toggleKeyboardShortcutsVisible,
  } = componentsStore;

  const [lineWidth, setLineWidth] = useState(0);

  // HotKeys callback functions.
  const insertFootnote = useCallback(createEntity(
    dispatch,
    CREATE_FOOTNOTE_POINTER_ACTION,
    count,
  ), []);
  const toggleDropdown = useCallback(() => console.log('Open'), []);
  const toggleOptionsPanel = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      toggleRightDrawerVisible();
      readOnlyState.locked ? unlockEditor() : lockEditor();
    }, [toggleRightDrawerVisible, readOnlyState.locked,
      unlockEditor, lockEditor],
  );
  const toggleKeyboardShortcuts = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    toggleKeyboardShortcutsVisible();
    readOnlyState.locked ? unlockEditor() : lockEditor();
  }, [toggleKeyboardShortcutsVisible, readOnlyState.locked,
    unlockEditor, lockEditor]);

  const editorRef = useRef<IRxEditor>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);

  const {
    // disableDoubleSpaces,
    // enforceEmDash,
    footnotes,
  } = props;

  const shortcutKeyHandlers = {
    INSERT_FOOTNOTE: insertFootnote,
    TOGGLE_DROPDOWN: toggleDropdown,
    TOGGLE_OPTIONS_PANEL: toggleOptionsPanel,
    TOGGLE_KEYBOARD_SHORTCUTS: toggleKeyboardShortcuts,
  };

  // The main trick for creating pagination with Draft.js. We take advantage
  // of Draft's default behavior to group contiguous blocks of the same type.
  //
  // Next, we assign the same page wrapper component to our 2 custom block
  // types. A new page is created by alternating block types between
  // adjacent blocks.
  const blockRenderMap = Map({
    'unstyled': {
      element: 'div',
      wrapper: <RxEditorPage
        editorState$={editorState$}
        editorState={editorState.current}
        footnotesActive={footnotes || false}
        ref={innerWrapperRef}
        onFocus={onFocus}
      />,
    },
    'unstyled-alt': {
      element: 'div',
      wrapper: <RxEditorPage
        editorState$={editorState$}
        editorState={editorState.current}
        footnotesActive={footnotes || false}
        ref={innerWrapperRef}
        onFocus={onFocus}
      />,
    },
  });

  // We may want to pass custom props to line blocks in future. Keeping
  // the option available here, but at the moment it does nothing.
  const lineBlockRenderer = (
    contentBlock: IContentBlock,
  ): ILineBlock | undefined => {
    const type = contentBlock.getType();
    if (type === UNSTYLED_BLOCK_TYPE || type === UNSTYLED_ALT_BLOCK_TYPE) {
      return {
        component: RxLineBlock,
        editable: true,
        props: {
          editorState,
          editorState$,
        },
      };
    }
  };

  // Auto-focuses editor when rendered.
  // https://github.com/draft-js-plugins/draft-js-plugins/issues/800
  useEffect(() => {
    setTimeout(() => editorRef.current!.focus(), 0);
    onFocus();

    reaction(
      () => footnoteStore.count,
      () => setTimeout(editorRef.current!.focus(), 0),
    );
  }, [footnoteStore.count, onFocus]);

  useEffect(() => {
    // Wrap the current line width in an observable so MobX can react to
    // changes.
    const lineWidth$ = observable({
      current: lineWidth,
    });

    reaction(
      // Observes changes to the width of the DOM node.
      () => lineWidth$.current,
      // Creates a new line block when the current line width exceeds 620px.
      width => width > 630
        ? handleLineBlock(editorState.current, editorState$)
        : undefined,
      {
        fireImmediately: true,
      },
    );

    const editorNode = editorRef.current!.editor.editorContainer;

    // Listens for changes in the DOM subtree, such as when a character is
    // typed. This allows the width of the current line to be re-computed to
    // determine when text should overflow to the next line.
    const subtreeObserver = new MutationObserver(() => {
      let currentLineWidth = 0;

      const selectionState = editorState.current.getSelection();
      const startKey = selectionState.getStartKey();
      const lineNode =
        editorNode.querySelector(`div[data-offset-key^="${startKey}-0-0"]`);
      const lineChildNodes = lineNode.firstChild.childNodes;

      if (!lineChildNodes) {
        return;
      }

      lineChildNodes.forEach(
        (span: HTMLElement) =>
          currentLineWidth += span.getBoundingClientRect().width,
      );

      setLineWidth(currentLineWidth);
    });

    subtreeObserver.observe(editorNode, {
      subtree: true,
      attributes: true,
      childList: true,
    });

    return () => {
      subtreeObserver.disconnect();
    };
  }, [lineWidth, editorState, editorState$]);

  // Preventing the standard text dragging behaviour within the editor is
  // necessary, otherwise it will ruin the page layout.
  const dragEvents$: Observable<any> = useObservable(
    () => from(dragEvents).pipe(
      mergeMap(e => fromEvent(document, e)),
    ),
  );
  useSubscription(dragEvents$, (e: React.DragEvent) => e.preventDefault());

  const keydown$: Observable<any> = useObservable(
    () => fromEvent(document, 'keydown'),
  );
  useSubscription(keydown$, (e: React.KeyboardEvent) => {
      const { key, ctrlKey, shiftKey } = e;
      const hasFocus = editorState.current.getSelection().getHasFocus();

      if (hasFocus) {
        if (key === 'Tab' && !readOnlyState.locked) {
          const currentState = editorState.current;
          rxTabHandler(
            currentState,
            editorState$,
            e,
            currentState.getCurrentInlineStyle(),
            lineWidth,
          );
        }
      }

      // Listen for keyboard events to re-focus the editor.
      if (readOnlyState.locked && key) {
        editorState.current.getSelection().isCollapsed()
          ? editorRef.current!.blur()
          : e.preventDefault();
      }

      if (
        !readOnlyState.locked &&
        !hasFocus &&
        !ctrlKey &&
        !shiftKey &&
        !keyExceptions.includes(key) &&
        key
      ) {
        editorRef.current!.focus();
        onFocus();
      }
    },
  );

  return useObserver(() =>
    <HotKeys keyMap={keyMap} handlers={shortcutKeyHandlers}>
      <RxEditor
        ref={editorRef}
        editorState={editorState.current}
        editorState$={editorState$}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={readOnlyState.locked}
        plugins={plugins}
        placeholder={RX_EDITOR_PLACEHOLDER}
        inlineToolbarPlugin={inlineToolbarPlugin}
        linkPlugin={linkPlugin}
        blockRenderMap={blockRenderMap}
        blockStyleFn={blockStyleFn}
        decorators={customDecorators}
        blockRendererFn={lineBlockRenderer}
        keyBindingFn={keyBindingFn}
        handlePastedText={handlePastedText}
        handleBeforeInput={handleBeforeInput}
        handlePastedFiles={handlePastedFiles}
        handleDrop={handleDrop}
      />
    </HotKeys>,
  );
};
