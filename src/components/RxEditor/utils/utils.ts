import { EditorState, Modifier, SelectionState } from 'draft-js';
import { BehaviorSubject } from 'rxjs';

import { editorStore } from '../../../stores/RxEditorStore';
import { INSERT_CHARACTERS_CHANGE_TYPE } from './constants';

/**
 * Manually select the entirety of the editor's text when the browser's
 * native "select all" behavior is disabled.
 */
export const selectAllText = (
  editorState: EditorState,
  editorState$: BehaviorSubject<EditorState>,
) => {
  const { setCaretVisibility } = editorStore;
  setCaretVisibility('hidden');

  const contentState = editorState.getCurrentContent();
  const firstBlockKey = contentState.getFirstBlock().getKey();
  const lastBlockKey = contentState.getLastBlock().getKey();
  const lastBlockText = contentState.getLastBlock().getText();
  const selectionState = new SelectionState({
    anchorKey: firstBlockKey,
    anchorOffset: 0,
    focusOffset: lastBlockText.length,
    focusKey: lastBlockKey,
  });

  editorState$.next(
    EditorState.forceSelection(
      editorState,
      selectionState,
    ),
  );
};

export const deleteSelectedText = (
  editorState: EditorState,
  editorState$: BehaviorSubject<EditorState>,
) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();

  const anchorKey = selectionState.getAnchorKey();
  const focusKey = selectionState.getFocusKey();
  const anchorOffset = selectionState.getAnchorOffset();
  const focusOffset = selectionState.getFocusOffset();

  const newContentState = Modifier.replaceText(
    contentState,
    new SelectionState({
      anchorKey: anchorKey,
      focusKey: focusKey,
      anchorOffset: anchorOffset,
      focusOffset: focusOffset,
    }),
    '',
  );

  editorState$.next(
    EditorState.push(
      editorState,
      newContentState,
      INSERT_CHARACTERS_CHANGE_TYPE,
    ),
  );
};

/**
 * Returns the specified number of characters immediately preceding the
 * current position of the cursor (i.e. collapsed selectionState).
 */
export const getCharsPrecedingFocus = (
  contentState: any,
  selectionState: any,
  numberOfChars: number,
): string => {
  const currentBlock =
    contentState.getBlockForKey(selectionState.getAnchorKey());
  const currentBlockText = currentBlock.getText();
  const endOfText = selectionState.getEndOffset();

  return currentBlockText.slice(
    endOfText - numberOfChars,
    endOfText,
  );
};

/**
 * Returns the current word count of the editor.
 */
export const getWordCount = (editorState: EditorState) => {
  const plainText = editorState.getCurrentContent().getPlainText('');
  const regex = /(?:\r\n|\r|\n)/g;
  const cleanString = plainText.replace(regex, ' ').trim();
  const wordArray = cleanString.match(/\S+/g);

  return wordArray ? wordArray.length : 0;
};

/**
 * Creates a temporary element to copy the selected range's text.
 */
export const copyToClipboard = (
  editorState: EditorState,
) => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock
    .getText()
    .slice(start, end);
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = selectedText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};

/**
 * Scans the current line for the presence of entities. Useful for disabling
 * auto-capitalisation and other text replacement methods that would
 * potentially delete an entity.
 */
export const currentBlockHasEntities = (
  contentState: any,
  currentBlock: any,
  entityType: string,
) => {
  const entities: any[] = [];
  let selectedEntity: any = null;

  currentBlock.findEntityRanges(
    (character: any) => {
      if (character.getEntity() !== null) {
        const entity = contentState.getEntity(character.getEntity());
        if (!entityType || (entityType && entity.getType() === entityType)) {
          selectedEntity = {
            entityKey: character.getEntity(),
            blockKey: currentBlock.getKey(),
            entity: contentState.getEntity(character.getEntity()),
          };
          return true;
        }
      }
      return false;
    },
    (start: any, end: any) => {
      entities.push({ ...selectedEntity, start, end });
    },
  );

  return entities.length > 0;
};

export const forceSelection = (
  editorState: EditorState,
  editorState$: BehaviorSubject<EditorState>,
) => {
  const selectionState = editorState.getSelection();
  const focusOffset = editorState.getSelection().getFocusOffset();
  const focusKey = selectionState.getFocusKey();

  editorState$.next(
    EditorState.forceSelection(
      editorState,
      new SelectionState({
        anchorKey: focusKey,
        anchorOffset: focusOffset,
        focusKey: focusKey,
        focusOffset: focusOffset,
      })
    )
  )
};