import React from 'react';
import { EditorState, RichUtils } from 'draft-js';

import { HIGHLIGHT_PAYLOAD } from '../../../components/RxEditor/utils/constants';

import { RxEditorActionPayload } from '../../../types/rxEditor';

export default () => {
  return {
    customStyleMap: {
      SMALL_CAPS: {
        fontVariant: 'small-caps',
      },
      SUBSCRIPT: {
        fontSize: '80%',
        verticalAlign: 'sub',
        lineHeight: '1',
      },
      SUPERSCRIPT: {
        fontSize: '80%',
        verticalAlign: 'super',
        lineHeight: '1',
      },
      HIGHLIGHT: {
        backgroundColor: '#8cff0d',
      },
    },
    keyBindingFn: (e: React.KeyboardEvent) => {
      const { key, altKey } = e;
      if (altKey && key === 'h') {
        return HIGHLIGHT_PAYLOAD;
      }
    },
  };
};
