import React, { Fragment, forwardRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';

import RxInlineToolbar from '../RxInlineToolbar/RxInlineToolbar';

import { IRxEditorProps } from '../../types/rxEditor';

export default forwardRef((props: IRxEditorProps, ref: any) => {
  const {
    editorState,
    editorState$,
    plugins,
    // placeholder,
    decorators,
    onFocus,
    onBlur,
    readOnly,
    inlineToolbarPlugin,
    linkPlugin,
    blockStyleFn,
    blockRenderMap,
    keyBindingFn,
    handlePastedText,
    handleBeforeInput,
    handlePastedFiles,
    blockRendererFn,
    handleDrop,
  } = props;
  const { InlineToolbar } = inlineToolbarPlugin;
  const { LinkButton } = linkPlugin;

  return (
    <Fragment>
      <Editor
        editorState={editorState}
        onChange={(editorState: EditorState): void =>
          editorState$.next(editorState)}
        plugins={plugins}
        readOnly={readOnly}
        ref={ref}
        decorators={decorators}
        onFocus={onFocus}
        onBlur={onBlur}
        blockStyleFn={blockStyleFn}
        blockRenderMap={blockRenderMap}
        blockRendererFn={blockRendererFn}
        keyBindingFn={keyBindingFn(
          editorState,
          editorState$,
          readOnly,
        )}
        handlePastedText={handlePastedText(editorState$)}
        handleBeforeInput={handleBeforeInput(editorState$)}
        handlePastedFiles={handlePastedFiles(editorState$)}
        handleDrop={handleDrop(editorState$)}
        // placeholder={placeholder}
        autoComplete="true"
        autoCorrect="true"
      />
      <RxInlineToolbar
        InlineToolbar={InlineToolbar}
        LinkButton={LinkButton}
      />
    </Fragment>
  );
});
