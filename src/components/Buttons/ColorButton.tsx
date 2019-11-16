import React, { useContext, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { BlockPicker } from 'react-color';

import RxEditorContext from '../../stores/RxEditorContext';
import {
  StyledImage,
  StyledContainer,
  StyledPopover,
} from '../common/StyledComponents';
import { toggleInlineStyle } from '../../actions';

export const ColorButton = ({ command, shortcut, icon }: any) => {
  const [visible, setVisible] = useState(false);

  const editorStore = useContext(RxEditorContext);
  const {
    readOnlyState,
    lockEditor,
    unlockEditor,
    highlightColor,
    setHighlightColor,
    dispatch,
    inlineToolbarVisible,
    setInlineToolbarVisible,
  } = editorStore;

  const handleVisibleChange = () => {
    setInlineToolbarVisible(true);
    setVisible(!visible);
    readOnlyState.locked ? unlockEditor() : lockEditor();
  };

  const capitalisedTitle = command.charAt(0)
    + command.substr(1).toLowerCase();
  const defaultHighlightColors = ['#D9E3F0', '#F47373', '#00FFE4', '#8CFF0D',
    '#2CCCE4', '#FF00F3', '#DCE775', '#FF8A65', '#BA68C8'];

  return (
    <Tooltip
      title={`${capitalisedTitle} (${shortcut})`}
    >
      <StyledPopover
        content={
          <StyledContainer
            onContextMenu={e => e.preventDefault()}
          >
            <BlockPicker
              triangle={'hide'}
              color={highlightColor}
              colors={defaultHighlightColors}
              onChangeComplete={(color: any) => {
                setHighlightColor(color);
                handleVisibleChange();
                toggleInlineStyle(dispatch, command);
              }}
            />
          </StyledContainer>
        }
        title={
          <StyledContainer>
            {`Select ${capitalisedTitle} Color`}
          </StyledContainer>
        }
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger="click"
      >
        <Button
          ghost
          type="link"
        >
          <StyledImage src={icon} width="22" height="22" />
        </Button>
      </StyledPopover>
    </Tooltip>
  );
};
