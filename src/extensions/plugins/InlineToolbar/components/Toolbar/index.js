import React, { useState, useEffect, useRef, /*useContext*/ } from 'react';
import styled from 'styled-components';
import { getVisibleSelectionRect } from 'draft-js';
import { useObserver } from 'mobx-react-lite';

//import RxEditorContext from '../../../../../stores/RxEditorContext';

const StyledInlineToolbar = styled.div`
  padding-top: 8px;
  transition: transform 0.15s cubic-bezier(.3,1.2,.2,1);
  position: absolute;
  z-index: 998;
  width: 440px;
  height: 50px;
  display: inline-flex;
  border: 2px solid #333;
  border-radius: 2px;
  background-color: #FFF;
`;

export default (props) => {
  //const editorStore = useContext(RxEditorContext);
  //const {
  //  toggleInlineToolbarVisible,
  //} = editorStore;
  const [toolbarPosition, setToolbarPosition] = useState(undefined);
  const [content, setContent] = useState(undefined);

  const toolbarRef = useRef(null);

  useEffect(() => store.subscribeToItem('selection', onSelectionChanged), []);

  const { store } = props;

  const onOverrideContent = overrideContent => {
    setContent({ overrideContent });
  };

  const onSelectionChanged = () => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      if (!toolbarRef) {
        return;
      }

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      const editorRef = store.getItem('getEditorRef')();
      if (!editorRef) {
        return;
      }

      // This keeps backwards compatibility with React 15
      let editorRoot = editorRef.refs && editorRef.refs.editor
        ? editorRef.refs.editor
        : editorRef.editor;
      while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
        editorRoot = editorRoot.parentNode;
      }
      const editorRootRect = editorRoot.getBoundingClientRect();

      const selectionRect = getVisibleSelectionRect(window);
      if (!selectionRect) {
        return;
      }

      // The toolbar shouldn't be positioned directly on top of the selected
      // text, but rather with a small offset so the caret doesn't overlap with
      // the text.
      const extraTopOffset = -12;

      const position = {
        top:
          editorRoot.offsetTop
          - toolbarRef.current.offsetHeight
          + (selectionRect.top - editorRootRect.top)
          + extraTopOffset,
        left:
          editorRoot.offsetLeft
          + (selectionRect.left - editorRootRect.left)
          + selectionRect.width / 2,
      };
      setToolbarPosition({ position });
    });
  };

  const getStyle = () => {
    const selection = store.getItem('getEditorState')().getSelection();
    // overrideContent could for example contain a text input, hence we always
    // show overrideContent TODO: Test readonly mode and possibly set isVisible
    // to false if the editor is readonly
    const isVisible =
      (!selection.isCollapsed() && selection.getHasFocus()) || content;
    const style = { ...toolbarPosition };

    if (style && style.position) {
      const { left, top } = style.position;
      style.left = left;
      style.top = top;
      if (isVisible) {
        style.visibility = 'visible';
        style.transform = 'translate(-50%) scale(1)';
      } else {
        style.transform = 'translate(-50%) scale(0)';
        style.visibility = 'hidden';
      }
    }

    return style;
  };

  const OverrideContent = content;

  const childrenProps = {
    getEditorState: store.getItem('getEditorState'),
    setEditorState: store.getItem('setEditorState'),
    onOverrideContent: onOverrideContent,
  };

  return useObserver(() =>
    <StyledInlineToolbar
      style={getStyle()}
      ref={toolbarRef}
    >
      {content ? (
        <OverrideContent {...childrenProps} />
      ) : (
        props.children(childrenProps)
      )}
    </StyledInlineToolbar>,
  );
};
