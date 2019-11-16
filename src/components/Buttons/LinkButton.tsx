import React, { useContext } from 'react';
import { Tooltip } from 'antd';

import RxEditorContext from '../../stores/RxEditorContext';
import { StyledThemedButton, StyledImage } from '../common/StyledComponents';
import { createEntity } from '../../actions';
import { CREATE_LINK_ACTION } from '../RxEditor/utils/constants';

export const LinkButton = ({ command, shortcut, icon }: any) => {
  const editorStore = useContext(RxEditorContext);
  const { dispatch } = editorStore;

  return (
    <Tooltip
      title={`Create a link (${shortcut})`}
    >
      <StyledThemedButton
        onMouseDown={createEntity(dispatch, CREATE_LINK_ACTION, command)}
      >
        <StyledImage src={icon} width="18" height="18" />
      </StyledThemedButton>
    </Tooltip>
  );
};
