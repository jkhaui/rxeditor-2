import React, { useContext } from 'react';
import { Button, Tooltip } from 'antd';

import RxEditorContext from '../../stores/RxEditorContext';

import { StyledThemedButton, StyledImage } from '../common/StyledComponents';
import { undoRedo } from '../../actions';

export const UndoRedoButton = ({ command, icon, shortcut }: any) => {
  const editorStore = useContext(RxEditorContext);
  const { dispatch } = editorStore;

  return (
    <Tooltip
      title={
        command.charAt(0) + command.substr(1).toLowerCase() + ` (${shortcut})`
      }>
      <Button
        ghost
        type="link"
        onMouseDown={undoRedo(dispatch, command)}
      >
        <StyledImage src={icon} width="18" height="18" />
      </Button>
    </Tooltip>
  );
};
