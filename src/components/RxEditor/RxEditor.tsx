import React, { Fragment, forwardRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';

import RxInlineToolbar from '../RxInlineToolbar/RxInlineToolbar';

import { IRxEditorProps } from '../../types/rxEditor';

export default forwardRef((props: IRxEditorProps, ref: React.Ref<{}>) => {
  const {
    editorState,
    editorState$,
    inlineToolbarPlugin,
    linkPlugin,
    keyBindingFn,
    handlePastedText,
    handleBeforeInput,
    handlePastedFiles,
    handleDrop,
    readOnly,
    placeholder,
    ...rest
  } = props;
  const { InlineToolbar } = inlineToolbarPlugin;
  const { LinkButton } = linkPlugin;

  return (
    <Fragment>
      <Editor
        ref={ref}
        editorState={editorState}
        onChange={(editorState: EditorState) => editorState$.next(editorState)}
        keyBindingFn={keyBindingFn(
          editorState,
          editorState$,
          readOnly,
        )}
        handlePastedText={handlePastedText(editorState$)}
        handleBeforeInput={handleBeforeInput(editorState$)}
        handlePastedFiles={handlePastedFiles(editorState$)}
        handleDrop={handleDrop(editorState$)}
        autoComplete="true"
        autoCorrect="true"
        readOnly={readOnly}
        {...rest}
      />
      <RxInlineToolbar
        InlineToolbar={InlineToolbar}
        LinkButton={LinkButton}
      />
    </Fragment>
  );
});
