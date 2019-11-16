import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  SelectionState,
  Modifier,
  RichUtils,
} from 'draft-js';
import { BehaviorSubject } from 'rxjs';

import { LOCAL_STORAGE_KEY } from '../utils/constants';
import { UNDO_PAYLOAD } from '../components/RxEditor/utils/constants';

import { footnoteStore } from '../stores/FootnoteStore';

import {
  EditorStatePayload,
  EditorStateStream,
  IReducer,
  RxEditorCommand,
} from '../types/rxEditor';

const reducer: IReducer = {
  editorState: (
    editorState: EditorState,
    editorState$: EditorStateStream,
    action: EditorStatePayload,
  ) => editorState$.next(action.payload),
  inlineStyle: (
    editorState: EditorState,
    editorState$: EditorStateStream,
    action: RxEditorCommand,
  ) => editorState$.next(
    RichUtils.toggleInlineStyle(
      editorState,
      action.payload,
    ),
  ),
  undoRedo: (
    editorState: EditorState,
    editorState$: EditorStateStream,
    action: RxEditorCommand,
  ) => action.payload === UNDO_PAYLOAD
    ? editorState$.next(
      EditorState.undo(editorState),
    )
    : editorState$.next(
      EditorState.redo(editorState),
    ),
  createLink: (
    editorState: EditorState,
    editorState$: EditorStateStream,
    action: RxEditorCommand,
  ) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {
        url: action.payload,
      },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithLink = Modifier.applyEntity(
      contentStateWithEntity,
      editorState.getSelection(),
      entityKey,
    );

    editorState$.next(
      EditorState.set(
        editorState,
        {
          currentContent: contentStateWithLink,
        },
      ),
    );
  },
  createFootnotePointer: (
    editorState: EditorState,
    editorState$: EditorStateStream,
    action: RxEditorCommand,
  ) => {
    const { incrementCount } = footnoteStore;
    incrementCount();

    const lastAddedFootnote = editorState
      .getCurrentContent()
      .getLastCreatedEntityKey();

    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const focusKey = selectionState.getFocusKey();
    const anchorOffset = selectionState.getAnchorOffset();
    const focusOffset = selectionState.getFocusOffset();

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'FOOTNOTE-POINTER',
      'IMMUTABLE',
      {
        count: action.payload,
      },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithFootnotePointer = Modifier.insertText(
      contentStateWithEntity,
      new SelectionState({
        anchorKey: anchorKey,
        anchorOffset: anchorOffset,
        focusKey: focusKey,
        focusOffset: focusOffset,
      }),
      `${parseInt(lastAddedFootnote) + 1} `,
      undefined,
      entityKey,
    );

    const editorStateWithEntity = EditorState.set(
      editorState,
      {
        currentContent: contentStateWithFootnotePointer,
      },
    );

    editorState$.next(
      editorStateWithEntity,
    );

    const currentBlockKey = selectionState.getFocusKey();
    const currentBlock = contentState.getBlockForKey(currentBlockKey);
    const currentBlockTextLength = currentBlock.getText().length;

    const forceSelection = new SelectionState({
      anchorKey: anchorKey,
      anchorOffset: currentBlockTextLength,
      focusKey: focusKey,
      focusOffset: currentBlockTextLength,
    });

    setTimeout(() => editorState$.next(
      EditorState.forceSelection(
        editorStateWithEntity,
        forceSelection,
      ),
    ), 0);
  }
  ,
  save: (editorState: EditorState) =>
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    ),
  load: (editorState$: EditorStateStream) => {
    editorState$.next(
      EditorState.createWithContent(
        convertFromRaw(
          JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)!),
        ),
      ),
    );
  },
};

export default reducer;

export const handleStream = (
  editorState$: BehaviorSubject<EditorState>,
) => (
  [action, editorState]: any[],
): any => {
  const { type } = action;
  const handler = reducer[type];

  const executeHandler = () => typeof handler === 'function'
    ? handler(editorState, editorState$, action)
    : undefined;
  executeHandler();
};
