// import { observable, reaction } from 'mobx';
import React, {/* useEffect, useState*//* useEffect, useState */ } from 'react';
// import { reaction, observable } from 'mobx';
import { EditorBlock } from 'draft-js';
import { handleLineBlock } from '../../core/layout';

// import { handleLineBlock } from './core/layout';

export default (props: any) => {
  // const [lineWidth, setLineWidth] = useState(0);
  //
  // const { editorState, editorState$ } = props.blockProps;
  //
  // useEffect(() => console.log(props.offsetKey), []);
  // // console.log(props.offsetKey);
  //
  // useEffect(() => {
  //   const lineWidth$ = observable({
  //     current: lineWidth,
  //   });
  //
  //   reaction(
  //     // Observes changes to the width of the DOM node.
  //     () => lineWidth$.current,
  //     // Creates a new line block when the current line width exceeds 620px.
  //     width => {
  //       // console.log(width)
  //       if (width > 620) {
  //         console.log('newline');
  //         handleLineBlock(editorState.current, editorState$);
  //       }
  //     },
  //     {
  //       fireImmediately: true,
  //     },
  //   );
  // }, [lineWidth]);
  //
  // useEffect(() => {
  //   const editorNode = document.querySelector('.DraftEditor-editorContainer');
  //
  //   const subtreeObserver = new MutationObserver(() => {
  //     let currentLineWidth = 0;
  //
  //     const selectionState = editorState.current.getSelection();
  //     const startKey = selectionState.getStartKey();
  //     const lineSpans =
  //       editorNode!.querySelectorAll(`span[data-offset-key^="${startKey}-0-"]`);
  //
  //     lineSpans.forEach((span: any) =>
  //       currentLineWidth += span.getBoundingClientRect().width);
  //
  //     setLineWidth(currentLineWidth);
  //   });
  //
  //   subtreeObserver.observe(editorNode!, {
  //     subtree: true,
  //     attributes: true,
  //     childList: true,
  //   });
  //
  //   return () => {
  //     subtreeObserver.disconnect();
  //   };
  // }, []);

  return (
    <EditorBlock {...props} />
  );
}
