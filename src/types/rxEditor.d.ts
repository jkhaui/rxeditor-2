import * as React from 'react';
import { EditorState } from 'draft-js';
import { BehaviorSubject } from 'rxjs';

// TODO: These type definitions aren't done well and should be much better.

export interface IRxEditor extends React.Component<IRxEditorProps, {}> {
  editorContainer: any;
  editor: any;
  focus: () => void;
  blur: () => void;
}

export type Dispatch = (
  action: any,
) => void;

export type RxEditorActionPayload =
  'INIT'
  | 'BOLD'
  | 'ITALIC'
  | 'UNDERLINE'
  | 'UNDO'
  | 'REDO'
  | 'STRIKETHROUGH'
  | 'SUPERSCRIPT'
  | 'SUBSCRIPT'
  | 'SAVE'
  | 'LOAD'
  | 'COPY'
  | 'CUT'
  | 'PRINT'
  | 'CONTEXT_MENU_ACTIVE'
  | 'CONTEXT_MENU_HIDDEN'
  | 'HIGHLIGHT'
  | 'SMALL_CAPS';

export type CaretState = 'visible' | 'hidden';

export type RxEditorActionType =
  '@INIT' | 'editorState' | 'inlineStyle' | 'createLink' | 'save' | 'load' |
  'undoRedo';

export type RxEditorCommand = {
  type: RxEditorActionType;
  payload: RxEditorActionPayload;
}

export interface ILineBlock {
  component: React.ComponentType<any>;
  editable: boolean;
  props: {}
}

export type EditorStatePayload = {
  payload: EditorState;
}

export type EditorStateStream = { next: (arg0: EditorState) => void; }

export interface IAction {
  type: RxEditorActionType;
  payload: RxEditorActionPayload;
}

export interface IReducer {
  [key: string]: any;
}

export interface IRxEditorProps {
  editorState: EditorState;
  editorState$: BehaviorSubject<EditorState>;
  readOnly: boolean | undefined;
  plugins: any;
  inlineToolbarPlugin: any;
  linkPlugin: any;
  blockRendererFn: any;
  decorators: any;
  onBlur: any;
  onFocus: any;
  blockStyleFn: any;
  blockRenderMap: ImmutableMap<any>;
  focus?: any;
  customStyleMap?: any;
  placeholder: string;
  keyBindingFn: any;
  handlePastedText: any;
  handleBeforeInput: any;
  handlePastedFiles: any;
  handleDrop: any;
}

export type ContentRect = {
  bounds: any;
}

export interface IEntityStrategyContentBlock {
  findEntityRanges: (
    arg0: (character: any) => boolean,
    arg1: any,
  ) => void;
}

export interface IEntityStrategyContentState {
  getEntity: (arg0: any) => { getType: () => void; };
}

export interface ITransformProps {
  editorState$?: any;
}

export interface IContentBlock {
  getText: () => void;
  findEntityRanges: (
    arg0: (character: any) => boolean,
    arg1: (
      nonEntityStart: any,
      nonEntityEnd: any,
    ) => void,
  ) => void;

  getType(): string;
}
