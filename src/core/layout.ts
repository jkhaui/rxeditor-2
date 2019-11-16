import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
  Modifier,
  SelectionState,
} from 'draft-js';
import { List, Repeat } from 'immutable';
import { BehaviorSubject } from 'rxjs';
import { IContentBlock } from '../types/rxEditor';

import {
  CHANGE_BLOCK_TYPE_CHANGE_TYPE,
  INSERT_CHARACTERS_CHANGE_TYPE,
  RXEDITOR_PAGE_LINE,
  SPLIT_BLOCK_CHANGE_TYPE,
  UNSTYLED_ALT_BLOCK_TYPE,
  UNSTYLED_BLOCK_TYPE,
} from '../components/RxEditor/utils/constants';

export const addNewPage = (
  editorState: any,
  editorState$: BehaviorSubject<EditorState>,
  keyOfLastBlock: any,
) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContentBlock = contentState.getBlockForKey(anchorKey);

  // const currentBlockText = currentContentBlock.getText();

  // The last word of the block should be the point at which the block is
  // split. const lastBlockWords = currentBlockText.split(' ');
  const lastBlockOfPageImmutable = contentState.getBlockForKey(keyOfLastBlock);
  const lastBlockOfPageText = lastBlockOfPageImmutable.getText();
  const nextPageBlock = contentState.getBlockAfter(keyOfLastBlock);

  const currentBlockType = currentContentBlock.getType();

  // Draft.js automatically groups contiguous runs of the same block type
  // within the same wrapper element, providing the visual appearance of a page.
  // When we want to create a new page, the trick is to "break out" of this
  // wrapper element by creating a new block with an alternate type. This
  // creates a new wrapper element and provides the pagination effect.
  const newBlockType = currentBlockType === UNSTYLED_BLOCK_TYPE
    ? UNSTYLED_ALT_BLOCK_TYPE
    : UNSTYLED_BLOCK_TYPE;

  // Check if we're at the end of the document and need to create a new page
  // block.
  if (!nextPageBlock) {
    const newBlockKey = genKey();
    const newCharacterData = CharacterMetadata.create();
    const newBlockWithSplitText = new ContentBlock({
      key: newBlockKey,
      text: lastBlockOfPageText,
      type: newBlockType,
      characterList: List(
        Repeat(newCharacterData, lastBlockOfPageText.length)),
    });

    // Create a new block map which includes the newly created page block.
    let newBlockMap = contentState.getBlockMap()
      .set(newBlockKey, newBlockWithSplitText);
    // Remove the last block of the current page to avoid duplication.
    newBlockMap = newBlockMap.remove(keyOfLastBlock);
    newBlockMap = newBlockMap.toArray();
    const newContentState = ContentState.createFromBlockArray(newBlockMap);

    editorState = EditorState.push(
      editorState,
      newContentState,
      CHANGE_BLOCK_TYPE_CHANGE_TYPE,
    );

    // Now update the selection state to prevent focus from jumping back
    // to the second-last block.
    const newLastBlock = editorState.getCurrentContent()
      .getBlockMap()
      .last();
    const keyOfNewLastBlock = newLastBlock.getKey();
    const lengthOfNewLastBlock = newLastBlock.getLength();

    if (anchorKey === keyOfLastBlock) {
      const newSelectionState = new SelectionState({
        anchorKey: keyOfNewLastBlock,
        anchorOffset: lengthOfNewLastBlock,
        focusKey: keyOfNewLastBlock,
        focusOffset: lengthOfNewLastBlock,
      });

      editorState$.next(
        EditorState.forceSelection(
          editorState,
          newSelectionState,
        ),
      );
    }
  }
  else {
    const blocksAsArray = contentState.getBlocksAsArray();
    const { length } = blocksAsArray;
    const lastBlockOfEachPageKeys: string[] = [];

    for (let i = 0; i < length; i++) {
      if (blocksAsArray[i + 1] &&
        blocksAsArray[i].getType() !== blocksAsArray[i + 1].getType()) {
        lastBlockOfEachPageKeys.push(blocksAsArray[i].getKey());
      }
    }

    console.log(lastBlockOfEachPageKeys);

    const lastBlockOfPage =
      contentState.getBlockForKey(lastBlockOfEachPageKeys[0]);
    const lastBlockOfPageText = lastBlockOfPage.getText();
    const lastBlockWords = lastBlockOfPageText.split(/\s/);
    const lastWordOfLastBlock = lastBlockWords[lastBlockWords.length - 1];

    const firstBlockOfNextPage = contentState.getBlockAfter(
      lastBlockOfEachPageKeys[0]);
    const firstBlockOfNextPageKey = firstBlockOfNextPage.getKey();
    console.log(firstBlockOfNextPage.getText());

    const selectionToMove = new SelectionState({
      anchorKey: lastBlockOfEachPageKeys[0],
      anchorOffset: lastWordOfLastBlock.length,
      focusKey: lastBlockOfEachPageKeys[0],
      focusOffset: lastBlockOfPageText.length,
    });
    console.log(selectionToMove);
    const selectionToInsert = new SelectionState({
      anchorKey: firstBlockOfNextPageKey,
      anchorOffset: 0,
      focusKey: firstBlockOfNextPageKey,
      focusOffset: 0,
    });
    console.log(selectionToInsert);
    const newContentState = Modifier.moveText(
      contentState,
      selectionToMove,
      selectionToInsert,
    );

    editorState = EditorState.push(
      editorState,
      newContentState,
      INSERT_CHARACTERS_CHANGE_TYPE,
    );

    // Handles the scenario where:
    // 1) The active page (i.e. the page the user is typing in) is already
    // followed by a consecutive page, and 2) Enough text has been entered to
    // trigger an overflow onto the next page.
    const currentKey = selectionState.getAnchorKey();
    const offsetLength = selectionState.getFocusOffset();

    const selectedBlock = new SelectionState({
      anchorKey: keyOfLastBlock,
      anchorOffset: 0,
      focusKey: keyOfLastBlock,
      focusOffset: lastBlockOfPageText.length,
    });
    const lastBlockWithMutatedType =
      Modifier.setBlockType(contentState, selectedBlock, newBlockType);

    editorState = EditorState.push(
      editorState,
      lastBlockWithMutatedType,
      INSERT_CHARACTERS_CHANGE_TYPE,
    );

    const newSelection = new SelectionState({
      anchorKey: currentKey,
      anchorOffset: offsetLength,
      focusKey: currentKey,
      focusOffset: offsetLength,
    });
    editorState =
      EditorState.forceSelection(editorState, newSelection);

  }
};

/**
 * Calls Draft.js' internal `splitBlock` method to render a new line block
 * within the page.
 */
export const handleLineBlock = (
  editorState: EditorState,
  editorState$: BehaviorSubject<EditorState>,
) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const currentLineKey = selectionState.getAnchorKey();
  const currentLine = contentState.getBlockForKey(currentLineKey);
  const currentLineText = currentLine.getText();
  const currentLineTextLength = currentLineText.length;

  const currentFocusOffset = selectionState.getFocusOffset();
  const hasFocusAtEndOfLine = currentFocusOffset === currentLineTextLength;

  const currentLineWordsAsArray = currentLineText.split(/\s/);
  const { length } = currentLineWordsAsArray;
  let lastWordOfCurrentLine = currentLineWordsAsArray[length - 1] !== ''
    ? currentLineWordsAsArray[length - 1]
    // Select the second last array item if the last item is an empty string.
    : currentLineWordsAsArray[length - 2] + ' ';

  const nextLine = editorState.getCurrentContent()
    .getBlockAfter(currentLineKey);

  // Edge-case where a single line overflows its wrapper but has no spaces,
  // e.g. user holding down a character key.
  if (length === 1) {
    lastWordOfCurrentLine =
      lastWordOfCurrentLine[lastWordOfCurrentLine.length - 1];
  }

  const currentLineSplitOffset =
    currentLineTextLength - lastWordOfCurrentLine.length;

  if (!nextLine) {
    const newSelectionState = new SelectionState({
      anchorKey: currentLineKey,
      anchorOffset: currentLineSplitOffset,
      focusKey: currentLineKey,
      focusOffset: currentLineSplitOffset,
    });

    const newContentState = Modifier.splitBlock(
      contentState,
      newSelectionState,
    );

    editorState$.next(
      EditorState.push(
        editorState,
        newContentState,
        SPLIT_BLOCK_CHANGE_TYPE,
      ),
    );
  }
  else {
    // If we are *not* at the end of the document
    const nextLineKey = nextLine.getKey();
    const currentLineFocusOffset = currentLineText.length;

    const selectionToMove = new SelectionState({
      anchorKey: currentLineKey,
      anchorOffset: currentLineFocusOffset - lastWordOfCurrentLine.length,
      focusKey: currentLineKey,
      focusOffset: currentLineFocusOffset,
    });

    const selectionToInsert = new SelectionState({
      anchorKey: nextLineKey,
      anchorOffset: 0,
      focusKey: nextLineKey,
      focusOffset: 0,
    });

    editorState$.next(
      EditorState.push(
        editorState,
        Modifier.moveText(
          contentState,
          selectionToMove,
          selectionToInsert,
        ),
        INSERT_CHARACTERS_CHANGE_TYPE,
      ),
    );
  }

  let selectionToFocusOn;
  const nextLineKey = editorState$.value
    .getCurrentContent()
    .getKeyAfter(currentLineKey);

  if (hasFocusAtEndOfLine) {
    const focusOffset = lastWordOfCurrentLine.length;
    selectionToFocusOn = new SelectionState({
      anchorKey: nextLineKey,
      anchorOffset: focusOffset,
      focusKey: nextLineKey,
      focusOffset: focusOffset,
    });
  }
  else {
    // Checks if current caret offset is inside the last word of the line
    // but NOT at the very end of the line.
    if (
      currentFocusOffset > currentLineSplitOffset &&
      currentFocusOffset < currentLineText.length
    ) {
      const nextLineFocusOffset = currentLineTextLength - currentFocusOffset;

      selectionToFocusOn = new SelectionState({
        anchorKey: nextLineKey,
        anchorOffset: nextLineFocusOffset,
        focusKey: nextLineKey,
        focusOffset: nextLineFocusOffset,
      });
    }
    else {
      selectionToFocusOn = new SelectionState({
        anchorKey: currentLineKey,
        anchorOffset: currentFocusOffset,
        focusKey: currentLineKey,
        focusOffset: currentFocusOffset,
      });
    }
  }
  editorState$.next(
    EditorState.forceSelection(editorState$.value, selectionToFocusOn),
  );
};

export const blockStyleFn = (contentBlock: IContentBlock) => {
  const type = contentBlock.getType();
  if (type === UNSTYLED_BLOCK_TYPE || type === UNSTYLED_ALT_BLOCK_TYPE) {
    return RXEDITOR_PAGE_LINE;
  }
};
export const getCaretCoordinates = (browserWindow: any) => {
  const selection = browserWindow.getSelection();
  let x = 0;
  let y = 0;
  let rect;
  let rects;

  if (selection && selection.rangeCount) {
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.collapse(true);
    rects = clonedRange.getClientRects();

    if (rects.length > 0) {
      rect = rects[0];
    }

    if (rect) {
      const { left, top } = rect;
      x = left + 1;
      y = top;
    }
  }

  return { x, y };
};