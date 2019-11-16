import React, { useContext } from 'react';
import { Button, Tooltip } from 'antd';

import RxEditorContext from '../../stores/RxEditorContext';

import { StyledImage } from '../common/StyledComponents';
import { undoRedo } from '../../actions';

import { RxEditorActionPayload } from '../../types/rxEditor';

interface IProps {
  command: RxEditorActionPayload;
  icon: any;
  shortcut: string;
}

export const UndoRedoButton = ({ command, icon, shortcut }: IProps) => {
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
