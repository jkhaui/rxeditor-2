import React, { useContext } from 'react';
import { Tooltip, Button } from 'antd';

import { SMALL_CAPS_PAYLOAD } from '../RxEditor/utils/constants';

import RxEditorContext from '../../contexts/RxEditorContext';
import { StyledImage } from '../common/StyledComponents';
import { toggleInlineStyle } from '../../actions';

export const InlineStyleButton = ({ command, shortcut, icon }: any) => {
  const editorStore = useContext(RxEditorContext);
  const { dispatch } = editorStore;

  return (
    <Tooltip
      title={
        shortcut
          ? `${command.charAt(0) +
          command.substr(1).toLowerCase()} (${shortcut})`
          : command !== SMALL_CAPS_PAYLOAD
          ? command.charAt(0) + command.substr(1).toLowerCase()
          : 'Small Caps (Ctrl + M)'
      }
    >
      <Button
        ghost
        type="link"
        onMouseDown={toggleInlineStyle(dispatch, command)}
      >
        <StyledImage src={icon} width="22" height="22" />
      </Button>
    </Tooltip>
  );
};
