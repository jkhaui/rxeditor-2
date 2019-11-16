import {
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js';
import nlp from 'compromise';
import { BehaviorSubject } from 'rxjs';
import { getBlockBeforeSelectedBlock } from 'draftjs-utils';

import { save } from '../actions';

import {
  ARROW_SYMBOL,
  COPYRIGHT,
  COPYRIGHT_REGISTERED_TRADEMARK_REGEX,
  REGISTERED_TRADEMARK,
  EM_DASH,
  EN_DASH,
  HANDLED,
  NOT_HANDLED,
  INSERT_CHARACTERS_CHANGE_TYPE,
  EN_DASH_REGEX,
  NON_CAPITALISED_REGEX,
  // ITALIC_PAYLOAD,
  // CHANGE_INLINE_STYLE_CHANGE_TYPE,
  NUMBERS_AT_START_OF_SENTENCE_REGEX,
  UNITS_REGEX,
  NUMBERS_REGEX,
  LOWER_CASE_REGEX,
} from '../components/RxEditor/utils/constants';

import { editorStore } from '../stores/RxEditorStore';
import {
  currentBlockHasEntities,
  getCharsPrecedingFocus,
} from '../components/RxEditor/utils/utils';
// import { ITALICISED_WORDS_REGEX } from './naturalLanguageProcessing';

const { dispatch } = editorStore;

export const handleBeforeInput = (
  editorState$: BehaviorSubject<EditorState>,
) => (
  chars: string,
  editorState: any,
) => {
  // Provides auto-saving behaviour.
  save(dispatch);

  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const focusOffset = selectionState.getFocusOffset();
  const startOffset = selectionState.getStartOffset();
  const currentBlockKey = selectionState.getAnchorKey();
  const currentBlock = contentState.getBlockForKey(currentBlockKey);
  const currentBlockText = currentBlock.getText();

  const hasEntities = currentBlockHasEntities(
    contentState,
    currentBlock,
    'FOOTNOTE-POINTER',
  );

  const entity = currentBlock.getEntityAt(startOffset);
  const style = editorState.getCurrentInlineStyle();

  const precedingThreeChars =
    getCharsPrecedingFocus(contentState, selectionState, 3);
  const precedingFourChars =
    getCharsPrecedingFocus(contentState, selectionState, 5);

  if (!hasEntities && NUMBERS_REGEX.test(currentBlockText)) {
    if (NUMBERS_AT_START_OF_SENTENCE_REGEX.test(currentBlockText)) {
      const numbersMatch =
        currentBlockText.match(NUMBERS_AT_START_OF_SENTENCE_REGEX)![1];

      if (numbersMatch) {
        const numberToWord = nlp(numbersMatch).values().toText().all().out();
        const numberToWordCapitalised =
          numberToWord.charAt(0).toUpperCase() + numberToWord.substr(1);

        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: focusOffset - numbersMatch.length - 1,
            focusOffset: focusOffset,
          }),
          numberToWordCapitalised + ' ' + chars,
          style,
        );

        editorState$.next(
          EditorState.push(
            editorState,
            newContentState,
            INSERT_CHARACTERS_CHANGE_TYPE,
          ),
        );
        return HANDLED;
      }
    }

    if (UNITS_REGEX.test(currentBlockText)) {
      const unitsMatch = currentBlockText.match(UNITS_REGEX);

      if (unitsMatch && unitsMatch[2] && unitsMatch[3]) {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: focusOffset - unitsMatch[0].length,
            focusOffset: focusOffset,
          }),
          ' ' + unitsMatch[2] + ' ' + unitsMatch[3] + chars,
          style,
        );

        editorState$.next(
          EditorState.push(
            editorState,
            newContentState,
            INSERT_CHARACTERS_CHANGE_TYPE,
          ),
        );
        return HANDLED;
      }
    }
  }

  /**
   * Autocapitalises the first character of a new sentence.
   */
  if (!hasEntities && NON_CAPITALISED_REGEX.test(currentBlockText)) {
    const autoCapitaliseMatch = precedingFourChars.match(NON_CAPITALISED_REGEX);
    if (autoCapitaliseMatch && autoCapitaliseMatch[1]) {
      const capitalisedChar = autoCapitaliseMatch[1].toUpperCase();
      const contentStateWithCapitalisedChar = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: focusOffset - 1,
          focusOffset: focusOffset,
        }),
        capitalisedChar + chars,
        style,
      );
      editorState$.next(
        EditorState.push(
          editorState,
          contentStateWithCapitalisedChar,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );

      return HANDLED;
    }
  }

  const previousBlock = getBlockBeforeSelectedBlock(editorState);
  const capitaliseFirstCharacterOfLine = () => {
    const currentBlockKey = selectionState.getFocusKey();
    const currentBlock = contentState.getBlockForKey(currentBlockKey);
    const currentBlockText = currentBlock.getText();

    // Don't auto-capitalise words containing an entity (e.g. a link),
    // because the entity will be wiped.
    if (!hasEntities && LOWER_CASE_REGEX.test(currentBlockText.slice(0, 1))) {
      const NON_CAPITALISED_LETTER = currentBlockText.match(LOWER_CASE_REGEX)[0]!;
      const CAPITALISED_LETTER = NON_CAPITALISED_LETTER.toUpperCase();
      const currentBlockTextLength = currentBlockText.length;
      const newText = CAPITALISED_LETTER
        + currentBlockText.slice(1, currentBlockTextLength);
      const currentCursorPosition = selectionState.getFocusOffset();

      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: currentBlockTextLength,
        }),
        newText,
        style,
      );

      const newSelectionState = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: currentCursorPosition,
        focusKey: currentBlockKey,
        focusOffset: currentCursorPosition,
      });

      editorState$.next(
        EditorState.push(
          EditorState.forceSelection(
            editorState,
            newSelectionState,
          ),
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );

      return HANDLED;
    }

    return NOT_HANDLED;
  };

  if (previousBlock) {
    const previousBlockText = previousBlock.getText();
    const previousBlockTextLength = previousBlockText.length;
    const hasText = previousBlockTextLength === 0
      ? false
      : previousBlockText !== ' ';

    if (previousBlockTextLength > 0 || !hasText) {
      let endsInPeriod = undefined;

      if (previousBlockTextLength > 0) {
        endsInPeriod = previousBlockText.slice(
          // Slice the last 2 characters in case there is a period followed by
          // a space.
          previousBlockTextLength - 2,
          previousBlockTextLength,
        );
      }

      // TODO: Account for selectionState being collapsed, also when editing
      //  mid-document and cursor is halfway through current line.
      if ((endsInPeriod && endsInPeriod.indexOf('.') !== -1) || !hasText) {
        capitaliseFirstCharacterOfLine();
      }
    }
  } else {
    // If there is no previous block, we're at the start of the document.
    capitaliseFirstCharacterOfLine();
  }

  if (precedingThreeChars.indexOf(' i ') !== -1) {
    const newContentState = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: focusOffset - 2,
        focusOffset: focusOffset,
      }),
      'I ' + (
        chars !== ' ' ? chars : ''
      ),
      style,
    );

    editorState$.next(
      EditorState.push(
        editorState,
        newContentState,
        INSERT_CHARACTERS_CHANGE_TYPE,
      ),
    );
    return HANDLED;
  }

  if (chars === ' ') {
    /**
     * Prevents double spaces.
     */
    if (currentBlockText.charAt(focusOffset - 1) === ' ') {
      return HANDLED;
    }

    /**
     * Enforce correct use of the em dash.
     */
    if (
      EN_DASH_REGEX.test(
        getCharsPrecedingFocus(
          contentState,
          selectionState,
          2,
        ),
      )
    ) {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: focusOffset - EN_DASH.length - 1,
          focusOffset: focusOffset,
        }),
        ' ' + EM_DASH + ' ',
        style,
      );

      editorState$.next(
        EditorState.push(
          editorState,
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );

      return HANDLED;
    }

    // let newContentState1;
    // if (!selectionState.isCollapsed()) {
    //   newContentState1 = Modifier.replaceText(
    //     contentState,
    //     selectionState,
    //     chars,
    //     style,
    //   );
    // } else {
    //   newContentState1 = Modifier.insertText(
    //     contentState,
    //     selectionState,
    //     chars,
    //     style,
    //   );
    // }
    // editorState$.next(
    //   EditorState.push(
    //     editorState,
    //     newContentState1,
    //     INSERT_CHARACTERS_CHANGE_TYPE,
    //   ),
    // );
    // return HANDLED;

    return NOT_HANDLED;
  }

  if (chars === ')') {
    /**
     * Converts (c) or (r) to © and ® symbols respectively.
     */
    if (COPYRIGHT_REGISTERED_TRADEMARK_REGEX.test(precedingThreeChars)) {
      const partialMatch =
        precedingThreeChars.match(COPYRIGHT_REGISTERED_TRADEMARK_REGEX)![0];

      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: focusOffset - partialMatch.length,
          focusOffset: focusOffset,
        }),
        partialMatch === '(c' ? COPYRIGHT : REGISTERED_TRADEMARK,
        style,
      );

      editorState$.next(
        EditorState.push(
          editorState,
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );
      return HANDLED;
    }

    const TRADEMARK_SYMBOL = '\u2122';
    const TRADEMARK_SYMBOL_REGEX = /\(tm/i;

    if (TRADEMARK_SYMBOL_REGEX.test(precedingFourChars)) {
      const partialMatch =
        precedingFourChars.match(TRADEMARK_SYMBOL_REGEX)![0];

      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: focusOffset - partialMatch.length,
          focusOffset: focusOffset,
        }),
        TRADEMARK_SYMBOL,
        style,
      );

      editorState$.next(
        EditorState.push(
          editorState,
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );
      return HANDLED;
    }
  }

  if (chars === '>') {
    /**
     * Converts `${en_dash}>` to `→`.
     */
    if (
      getCharsPrecedingFocus(contentState, selectionState, 2)
        .indexOf(EN_DASH) !== -1
    ) {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: focusOffset - 1,
          focusOffset: focusOffset,
        }),
        ARROW_SYMBOL,
        style,
      );

      editorState$.next(
        EditorState.push(
          editorState,
          newContentState,
          INSERT_CHARACTERS_CHANGE_TYPE,
        ),
      );

      return HANDLED;
    }
  }

  /**
   * Route all text input changes through our RxJS stream.
   */
  if (!entity) {
    let newContentState;
    if (!selectionState.isCollapsed()) {
      newContentState = Modifier.replaceText(
        contentState,
        selectionState,
        chars,
        style,
      );
    } else {
      newContentState = Modifier.insertText(
        contentState,
        selectionState,
        chars,
        style,
      );
    }

    editorState$.next(
      EditorState.push(
        editorState,
        newContentState,
        INSERT_CHARACTERS_CHANGE_TYPE,
      ),
    );

    return HANDLED;
  }

  return NOT_HANDLED;
};
