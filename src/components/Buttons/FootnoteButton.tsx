import React, { useContext } from 'react';
import { Tooltip } from 'antd';
import { useObserver } from 'mobx-react-lite';

import { createEntity } from '../../actions';
import RxEditorContext from '../../contexts/RxEditorContext';
import { StyledThemedButton, StyledImage } from '../common/StyledComponents';
import FootnoteContext from '../../contexts/FootnoteContext';
import { CREATE_FOOTNOTE_POINTER_ACTION } from '../RxEditor/utils/constants';

export const FootnoteButton = ({ shortcut, icon }: any) => {
  const editorStore = useContext(RxEditorContext);
  const footnoteStore = useContext(FootnoteContext);
  const { dispatch } = editorStore;

  return useObserver(() =>
    <Tooltip
      title={`Add footnote (${shortcut})`}
    >
      <StyledThemedButton
        block
        size={'large'}
        onMouseDown={createEntity(
          dispatch,
          CREATE_FOOTNOTE_POINTER_ACTION,
          // N.b. The `footnoteStore.count` property must NOT be
          // destructured outside the component, or else it won't update.
          footnoteStore.count,
        )}
        style={{
          height: 50,
        }}
      >
        <StyledImage
          src={icon}
          width={28}
          height={'auto'}
        />
      </StyledThemedButton>
    </Tooltip>,
  );
};

