import React from 'react';

import { HIGHLIGHT_PAYLOAD } from '../../../components/RxEditor/utils/constants';

export default () => {
  return {
    customStyleMap: {
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
    keyBindingFn: (e: React.KeyboardEvent): string | undefined => {
      const { key, altKey } = e;
      if (altKey && key === 'h') {
        return HIGHLIGHT_PAYLOAD;
      }
    },
  };
};
