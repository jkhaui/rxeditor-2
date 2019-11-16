import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  from,
  fromEvent,
  interval,
  // asyncScheduler,
  timer,
} from 'rxjs';
import {
  buffer,
  filter,
  mapTo,
  mergeMap,
  startWith,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs/operators';
import {
  useObservable,
  useSubscription,
} from 'observable-hooks';

import {
  clickEvents,
  arrowKeys,
  keyEvents,
  VISIBLE,
  HIDDEN,
} from './utils/constants';

const StyledCaret: any = styled.div`
  position: absolute;
  user-select: none;
  pointer-events: none;
  // @ts-ignore
  border-left: ${props => props.caretWidth} solid ${props => props.caretColor};
  display: block;
  width: 0;
  z-index: 998;
  height: 17.6px;
  margin-top: -2px;
  margin-left: -1px;
  // @ts-ignore
  visibility: ${props => props.caretVisibility}
`;

export default (props: any) => {
  const caretRef = useRef<any>(null);

  const {
    editorState,
    isFocused,
    caretColor,
    caretWidth,
    caretPosition,
    titleFocusState,
    setIsTyping,
    isTyping,
    caretVisibility,
    setCaretVisibility,
    blinkTest,
  } = props;
  const { x, y } = caretPosition;

  const focusCaretAtStart = () => {
    const innerWrapper = document.querySelector('.RxEditor-pageWrapper');
    if (innerWrapper) {
      const { top, left } = innerWrapper.getBoundingClientRect();
      caretRef.current.style.top = `${top}px`;
      caretRef.current.style.left = `${left + 96}px`;
    }
  };

  useEffect(() => {
    focusCaretAtStart();
    blinkTest();
  }, []);
  console.log(isTyping);
  useEffect(() => {
    const repositionCaret = () => !isTyping
      ? caretRef.current.style.left = `${x}px`
      : undefined;
    repositionCaret();
  }, [isTyping]);

  useEffect(() => {
    const shouldHideCaret = () => !editorState.getSelection().isCollapsed()
      ? setCaretVisibility(HIDDEN)
      : setCaretVisibility(VISIBLE);
    shouldHideCaret();
  }, [editorState]);

  const clickEvents$ = useObservable(() => from(clickEvents)
    .pipe(
      mergeMap(e => fromEvent(document, e)),
    ),
  );
  useSubscription(clickEvents$, (e: any) => {
    const { type } = e;
    if (type === 'click') {
      console.log('normal click');
      setCaretVisibility(VISIBLE);
      if (x === 0) {
        positionCaretOnEmptyLine();
      }
      caretRef.current.style.top = `${y}px`;
      caretRef.current.style.left = `${x}px`;
    } else {
      console.log('double click');
      // If double-click
      setCaretVisibility(HIDDEN);
    }
  });

  const keyEvents$ = useObservable(() => from(keyEvents)
    .pipe(
      mergeMap(e => fromEvent(document, e)),
    ),
  );

  const isTyping$ = useObservable(() => keyEvents$.pipe(
    tap(() => setCaretVisibility(VISIBLE)),
    switchMap(() => interval(750).pipe(
      // Every 750ms, the observable will emit the next number in the
      // sequence starting from 0. From here, we can use the modulus
      // operator to determine if it is odd/even and toggle the caret
      // visibility accordingly.
      tap((x: number) => x % 2 === 0
        ? setCaretVisibility(HIDDEN)
        : setCaretVisibility(VISIBLE),
      ),
    )),
    buffer(keyEvents$.pipe(
      throttleTime(750),
    )),
    filter(keypressArray => keypressArray.length >= 6),
    switchMap(() =>
      timer(2000).pipe(
        mapTo(false),
        startWith(true),
      )),
  ), [editorState]);
  useSubscription(isTyping$, x => console.log(x));

  // const isBlinking$ = useObservable(
  //   // Only fires if typing
  //   () => isTyping$.pipe(
  //     tap(() => caretRef.current.style.visibility = VISIBLE),
  //     filter(isTyping => isTyping === false),
  //     switchMap(() => interval(750).pipe(
  //       tap((x: number) => x % 2 === 0
  //         ? caretRef.current.style.visibility = HIDDEN
  //         : caretRef.current.style.visibility = VISIBLE,
  //       ),
  //     )),
  //   ),
  // );
  //
  // useSubscription(isBlinking$);

  useSubscription(keyEvents$, (e: any) => {
    const { key } = e;
    if (isFocused) {
      if (key.includes(arrowKeys)) {
        caretRef.current.style.top = `${y}px`;
        caretRef.current.style.left = `${x}px`;
        return () => x === 0
          ? positionCaretOnEmptyLine()
          : undefined;
      }
      setIsTyping(true);
      if (x === 0) {
        return !editorState.getCurrentContent().hasText()
          ? focusCaretAtStart()
          : positionCaretOnEmptyLine();
      }
      caretRef.current.style.top = `${y}px`;

      isTyping
        ? caretRef.current.style.left = `${x + 1}px`
        : caretRef.current.style.left = `${x}px`;
    }
  });

  const positionCaretOnEmptyLine = () => {
    const currentBlockKey = editorState.getSelection().getFocusKey();
    const currentLineSpan =
      document.querySelector(`span[data-offset-key^="${currentBlockKey}-0-0"]`);
    if (currentLineSpan) {
      const { top, left } = currentLineSpan.getBoundingClientRect();
      caretRef.current.style.top = `${top}px`;
      caretRef.current.style.left = `${left}px`;
    }
  };

  return (
    <StyledCaret
      ref={caretRef}
      onContextMenu={(e: any) => e.preventDefault()}
      isTitleFocused={titleFocusState}
      isVisible={isFocused}
      isTyping={isTyping}
      isCollapsed={editorState.getSelection().isCollapsed()}
      caretColor={caretColor}
      caretWidth={caretWidth}
      caretVisibility={caretVisibility}
    />
  );
};

// const [isMouseDown, toggleMouseDown] = useState(false);
//
// const mouseDown$ = useObservable(
//   () => fromEvent(document, 'mousedown'),
// );
// const mouseUp$ = useObservable(
//   () => fromEvent(document, 'mouseup').pipe(
//     tap(() => console.log('mouseup!')),
//   ),
// );
//
// const mouseEvents$ = mouseDown$.pipe(
//   switchMap(
//     () => timer(500).pipe(
//       tap(() => console.log('HOLD')),
//       // tap(() => toggleMouseDown(true)),
//       takeUntil(mouseUp$),
//       // tap(() => console.log('finished'))
//     ),
//   ),
//   // tap(() => toggleMouseDown(false)),
// );
// useSubscription(mouseEvents$);
