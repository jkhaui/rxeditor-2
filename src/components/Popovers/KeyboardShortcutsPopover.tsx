import React, { Fragment } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Divider, Tooltip } from 'antd';

import {
  StyledBoldText,
  StyledHeading,
  StyledIcon,
  StyledPopover,
  StyledRegularText,
} from '../common/StyledComponents';
import keyboard from '../../assets/icons/keyboard.svg';

export default ({ componentsStore, handleKeyboardShortcutsVisibility }: any) =>
  useObserver(() =>
    <StyledPopover
      placement={'bottomRight'}
      visible={componentsStore.keyboardShortcutsVisible}
      onVisibleChange={handleKeyboardShortcutsVisibility}
      trigger={'click'}
      content={
        <Fragment>
          <StyledHeading>
            Keyboard shortcuts (Ctrl + K)
          </StyledHeading>
          <br />
          <Divider />
          <StyledRegularText>
            Show preferences: <StyledBoldText>Ctrl + Shift +
            P</StyledBoldText>
          </StyledRegularText>
          <br />
          <Divider />
          <StyledRegularText>
            Add full-stop followed by footnote: <StyledBoldText>Ctrl +
            .</StyledBoldText>
          </StyledRegularText>
          <br />
          <Divider />
          <StyledRegularText>
            Add footnote: <StyledBoldText>Ctrl + /</StyledBoldText>
          </StyledRegularText>
          <br />
          <Divider />
          <StyledRegularText>
            New Document: <StyledBoldText>Ctrl + D</StyledBoldText>
          </StyledRegularText>
          <br />
          <Divider />
          <StyledRegularText>
            Open Documents <StyledBoldText>Ctrl + O</StyledBoldText>
          </StyledRegularText>
        </Fragment>
      }
    >
      <Tooltip title={'Keyboard shortcuts (Ctrl + K)'} placement={'left'}>
        <StyledIcon
          src={keyboard}
          width={42}
          height={'auto'}
        />
      </Tooltip>
    </StyledPopover>,
  );