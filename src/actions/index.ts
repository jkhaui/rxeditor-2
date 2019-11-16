import React from 'react';

import {
  INLINE_STYLE_ACTION,
  LOAD_ACTION,
  SAVE_ACTION,
  UNDO_REDO_ACTION,
} from '../components/RxEditor/utils/constants';

import { RxEditorActionPayload, Dispatch } from '../types/rxEditor';

export const toggleInlineStyle = (
  dispatch: Dispatch,
  command: RxEditorActionPayload,
) => (
  e: React.MouseEvent | React.KeyboardEvent,
) => {
  e.preventDefault();
  dispatch({
    type: INLINE_STYLE_ACTION,
    payload: command,
  });
};

export const createEntity = (
  dispatch: Dispatch,
  action: string,
  command: string | number,
) => (
  e: any,
) => {
  e.preventDefault();
  dispatch({
    type: action,
    payload: command,
  });
};

export const undoRedo = (
  dispatch: Dispatch,
  command: RxEditorActionPayload,
) => (
  e: React.MouseEvent,
) => {
  e.preventDefault();
  dispatch({
    type: UNDO_REDO_ACTION,
    payload: command,
  });
};

export const save = (
  dispatch: any,
) => dispatch({
  type: SAVE_ACTION,
});

export const load = (
  dispatch: any,
) => (
  e: Event,
) => {
  e.preventDefault();
  dispatch({
    type: LOAD_ACTION,
  });
};
