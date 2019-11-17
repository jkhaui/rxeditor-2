import React from 'react';
import {
  ContentState,
  DraftInlineStyle,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  SelectionState,
} from 'draft-js';
import { BehaviorSubject } from 'rxjs';

import { editorStore } from '../stores/RxEditorStore';

import {
  BOLD_PAYLOAD,
  HANDLED,
  INSERT_CHARACTERS_CHANGE_TYPE,
  INSERT_FRAGMENT_CHANGE_TYPE,
  ITALIC_PAYLOAD,
  NOT_HANDLED,
  TAB_UNICODE,
  UNDERLINE_PAYLOAD,
} from '../components/RxEditor/utils/constants';

import { selectAllText } from '../components/RxEditor/utils/utils';
import { save, toggleInlineStyle } from '../actions';
import { handleLineBlock } from './layout';

const { dispatch } = editorStore;

export const keyBindingFn = (
  editorState: any,
  editorState$: BehaviorSubject<EditorState>,
  readOnly: boolean,
) => (
  e: React.KeyboardEvent,
) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const anchorKey = selectionState.getAnchorKey();
  const currentBlock = contentState.getBlockForKey(anchorKey);
  const currentBlockText = currentBlock.getText();

  const { isCtrlKeyCommand, hasCommandModifier } = KeyBindingUtil;
  const { key } = e;

  if (key) {
    if (key === 'Enter' && readOnly) {
      return HANDLED;
    }

    const currentBlockKey = selectionState.getFocusKey();
    const currentBlockIndex = contentState
      .getBlockMap()
      .keySeq()
      .findIndex((i: string) => i === currentBlockKey);
    const currentLineNumber = currentBlockIndex + 1;

    // Due to unresolved browser bugs with contenteditable, `PageUp` and
    // `PageDown` handling can ruin UX so we disable them and re-implement
    // page/line scrolling manually.
    const { scrollState } = editorStore;
    if ((key === 'PageUp' || key === 'PageDown') && !scrollState.locked) {
      e.preventDefault();
      e.stopPropagation();
      let newSelectionState;
      let lineNumber;
      let lineKey;
      const blocksAsArray = contentState.getBlocksAsArray();

      if (selectionState.isCollapsed) {
        if (key === 'PageUp') {
          if (currentLineNumber < 28) {
            const firstLineKey = contentState.getFirstBlock().getKey();
            newSelectionState = new SelectionState({
              anchorKey: firstLineKey,
              anchorOffset: 0,
              focusKey: firstLineKey,
              focusOffset: 0,
            });
          } else {
            lineNumber = blocksAsArray[currentLineNumber - 27];
            lineKey = lineNumber.getKey();
            newSelectionState = new SelectionState({
              anchorKey: lineKey,
              anchorOffset: 0,
              focusKey: lineKey,
              focusOffset: 0,
            });
          }
        } else {
          const lastLineBlock = contentState.getLastBlock();
          const lastLineKey = lastLineBlock.getKey();
          if (currentLineNumber < 28) {
            newSelectionState = new SelectionState({
              anchorKey: lastLineKey,
              anchorOffset: 0,
              focusKey: lastLineKey,
              focusOffset: 0,
            });
          } else {
            lineNumber = blocksAsArray[currentLineNumber + 27]
              ? blocksAsArray[currentLineNumber + 27]
              : lastLineBlock;
            lineKey = lineNumber.getKey();
            newSelectionState = new SelectionState({
              anchorKey: lineKey,
              anchorOffset: 0,
              focusKey: lineKey,
              focusOffset: 0,
            });
          }
        }

        editorState$.next(
          EditorState.forceSelection(
            editorState,
            newSelectionState,
          ),
        );
      }
    }

    /**
     * Ensure proper handling of the `Backspace` key at page boundaries.
     */
    if (key === 'Backspace') {
      save(dispatch);

      const currentBlockType = currentBlock.getType();
      const previousSiblingBlockKey = contentState.getKeyBefore(anchorKey);
      const previousSiblingBlock = contentState.getBlockForKey(
        previousSiblingBlockKey);

      if (previousSiblingBlock) {
        const previousSiblingBlockType = previousSiblingBlock.getType();
        // Check if we're at a page boundary.
        if (
          currentBlockType !== previousSiblingBlockType &&
          selectionState.getFocusOffset() === 0
        ) {
          // If the page is empty then delete it.
          if (currentBlockText === '') {
            let newBlockMap = contentState.getBlockMap();
            console.log(newBlockMap.toArray());
            newBlockMap = newBlockMap.remove(anchorKey);
            newBlockMap = newBlockMap.toArray();
            console.log(newBlockMap);
            const newContentState = ContentState.createFromBlockArray(
              newBlockMap);
            const editorStateWithDeletedBlock = EditorState.push(
              editorState,
              newContentState,
              INSERT_FRAGMENT_CHANGE_TYPE,
            );

            const previousBlockText = previousSiblingBlock.getText();
            const newSelection = new SelectionState({
              anchorKey: previousSiblingBlockKey,
              anchorOffset: previousBlockText.length,
              focusKey: previousSiblingBlockKey,
              focusOffset: previousBlockText.length,
            });
            editorState$.next(
              // Make sure we immediately force focus on what is now the
              // last block of the editor, to avoid ruining the user's flow.
              EditorState.forceSelection(
                editorStateWithDeletedBlock,
                newSelection,
              ),
            );
          } else {
            let textToMove = previousSiblingBlock
              .getText()
              .split(' ');
            textToMove = textToMove[textToMove.length - 1];

            const previousSiblingBlockOffset = previousSiblingBlock.getText();
            const textToMoveSelection = new SelectionState({
              anchorKey: previousSiblingBlockKey,
              anchorOffset: previousSiblingBlockOffset.length
                - textToMove.length - 1,
              focusKey: previousSiblingBlockKey,
              focusOffset: previousSiblingBlockOffset.length,
            });

            const newContentState = Modifier.replaceText(
              contentState,
              textToMoveSelection,
              '',
            );
            const newEditorState = EditorState.push(
              editorState,
              newContentState,
              INSERT_CHARACTERS_CHANGE_TYPE,
            );

            const selectionStateCollapsedAtStart = new SelectionState({
              anchorKey: anchorKey,
              anchorOffset: 0,
              focusKey: anchorKey,
              focusOffset: 0,
            });
            const contentStateAfterInsertText = Modifier.insertText(
              newContentState,
              selectionStateCollapsedAtStart,
              textToMove,
            );
            EditorState.push(
              newEditorState,
              contentStateAfterInsertText,
              INSERT_CHARACTERS_CHANGE_TYPE,
            );

            const textToMoveLength = textToMove.length;
            const newSelection = new SelectionState({
              anchorKey: anchorKey,
              anchorOffset: textToMoveLength,
              focusKey: anchorKey,
              focusOffset: textToMoveLength,
            });
            editorState$.next(
              EditorState.forceSelection(editorState, newSelection),
            );
          }

          return HANDLED;
        }
      }
    }

    if (isCtrlKeyCommand(e) || hasCommandModifier(e)) {
      const {
        toggleNewDocModalState,
        toggleSavedDocsModalState,
        toggleDownloadDocModalState,
        // setCaretVisibility,
      } = editorStore;

      switch (key) {
        case 'a':
          e.preventDefault();
          e.stopPropagation();
          selectAllText(editorState, editorState$);
          return HANDLED;
        case 'b':
          e.preventDefault();
          e.stopPropagation();
          toggleInlineStyle(dispatch, BOLD_PAYLOAD)(e);
          return HANDLED;
        case 'd':
          e.preventDefault();
          e.stopPropagation();
          toggleNewDocModalState();
          return HANDLED;
        case 'h':
          e.preventDefault();
          e.stopPropagation();
          return NOT_HANDLED;
        case 'i':
          e.preventDefault();
          e.stopPropagation();
          toggleInlineStyle(dispatch, ITALIC_PAYLOAD)(e);
          return HANDLED;
        case 'o':
          e.preventDefault();
          e.stopPropagation();
          toggleSavedDocsModalState();
          return HANDLED;
        case 's':
          e.preventDefault();
          e.stopPropagation();
          toggleDownloadDocModalState();
          return HANDLED;
        case 'm':
          e.preventDefault();
          e.stopPropagation();
          return HANDLED;
        case 'u':
          e.preventDefault();
          e.stopPropagation();
          toggleInlineStyle(dispatch, UNDERLINE_PAYLOAD)(e);
          return HANDLED;
        case 'v':
          e.preventDefault();
          e.stopPropagation();
          handlePastedText(editorState$);
          return HANDLED;
        default:
          // Any `ctrl` key shortcut we don't override will fall back to
          // Draft.js' normal behaviour.
          return getDefaultKeyBinding(e);
      }
    }
  }
};

/**
 * Implement the keydown behaviour of `Tab` which is typical of document
 * processors and code editors.
 */
export const rxTabHandler = (
  editorState: EditorState,
  editorState$: BehaviorSubject<EditorState>,
  e: React.KeyboardEvent,
  inlineStyles: DraftInlineStyle,
  currentLineWidth: number,
) => {
  e.preventDefault();
  e.stopPropagation();

  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  let newEditorState;

  if (selectionState.isCollapsed()) {
    if (currentLineWidth < 600) {
      const newContentState =
        Modifier.insertText(
          contentState,
          selectionState,
          TAB_UNICODE,
          inlineStyles,
        );
      newEditorState =
        EditorState.push(
          editorState,
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        );
    } else {
      return handleLineBlock(editorState, editorState$);
    }
  } else {
    const newContentState = Modifier.replaceText(
      contentState,
      selectionState,
      TAB_UNICODE,
      inlineStyles,
    );
    newEditorState = EditorState.push(
      editorState,
      newContentState,
      INSERT_CHARACTERS_CHANGE_TYPE,
    );
  }

  editorState$.next(newEditorState);
};

export const handleDrop = (
  editorState$: BehaviorSubject<EditorState>,
) => (
  selection: any,
  dataTransfer: any,
  isInternal: any,
) => {
  console.log(selection);
  console.log(dataTransfer);
  console.log(isInternal);
};

export const handlePastedText = (
  editorState$: BehaviorSubject<EditorState>,
) => (
  text: string,
  _html: string,
  _editorState: any,
) => {
  return NOT_HANDLED;
};

export const handlePastedFiles = (
  editorState$: BehaviorSubject<EditorState>,
) => (
  files: Blob[],
) => {
  console.log(files);
};
