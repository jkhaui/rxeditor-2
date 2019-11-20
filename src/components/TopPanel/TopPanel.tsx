import React, { Fragment, useContext } from 'react';
import { Row, Col, Tooltip, Drawer } from 'antd';
import { useObserver } from 'mobx-react-lite';
import styled from 'styled-components';

import undo from '../../assets/icons/undo.svg';
import redo from '../../assets/icons/redo.svg';
import gear from '../../assets/icons/gear.svg';

import { StyledBoldText, StyledContainer } from '../common/StyledComponents';
import { UndoRedoButton } from '../Buttons/UndoRedoButton';
import {
  REDO_PAYLOAD,
  REDO_SHORTCUT,
  UNDO_PAYLOAD,
  UNDO_SHORTCUT,
} from '../RxEditor/utils/constants';

import RxEditorContext from '../../contexts/RxEditorContext';
import KeyboardShortcutsPopover from '../Popovers/KeyboardShortcutsPopover';
import UserAccountPopover from '../Popovers/UserAccountPopover';
import RightDrawer from '../RightDrawer/RightDrawer';
import ComponentsContext from '../../contexts/ComponentsContext';
import { StyledHeading, StyledIcon } from '../common/StyledComponents';
import AuthenticationContext from '../../contexts/AuthenticationContext';

const StyledDemoHeading = styled(StyledBoldText)`
  cursor: pointer;
  color: #2EC4B6;
  transition: 0.5s;
  
    &:hover {
      opacity: 0.7;
    }
`;

const StyledDemoHeadingContainer = styled(StyledContainer)`
    user-select: none;
    font-family: 'VisbyCF-Bold',sans-serif !important;
    padding: 6px 6px 6px 9px;
    border: 2px solid #2EC4B6;
    border-radius: 2px;
`;

export default () => {
  const componentsStore = useContext(ComponentsContext);
  const authContext = useContext(AuthenticationContext);
  const editorStore = useContext(RxEditorContext);
  const {
    toggleRightDrawerVisible,
    toggleKeyboardShortcutsVisible,
  } = componentsStore;
  const {
    readOnlyState,
    lockEditor,
    unlockEditor,
  } = editorStore;

  // Visibility handlers for popover components.
  const handleKeyboardShortcutsVisibility = () => {
    toggleKeyboardShortcutsVisible();
    readOnlyState.locked ? unlockEditor() : lockEditor();
  };

  return useObserver(() =>
    <Row className={'TopPanel'}>
      {
        !authContext.guestMode
          ? <Col span={18} />
          : <Col span={17} />
      }
      <Col
        span={2}
        style={{
          minWidth: 100,
        }}
      >
        <UndoRedoButton
          icon={undo}
          command={UNDO_PAYLOAD}
          shortcut={UNDO_SHORTCUT}
        />
        <UndoRedoButton
          icon={redo}
          command={REDO_PAYLOAD}
          shortcut={REDO_SHORTCUT}
        />
      </Col>
      <Col
        span={1}
        style={{
          minWidth: 50,
        }}
      >
        <KeyboardShortcutsPopover
          componentsStore={componentsStore}
          handleKeyboardShortcutsVisibility={handleKeyboardShortcutsVisibility}
        />
      </Col>
      <Col
        span={1}
        style={{
          minWidth: 50,
        }}
      >
        <Tooltip title={'Preferences'} placement={'left'}>
          <StyledIcon
            src={gear}
            width={42}
            height={'auto'}
            onClick={() => toggleRightDrawerVisible()}
          />
        </Tooltip>
      </Col>
      {
        !authContext.guestMode
          ? <Fragment>
            <Col span={1}>
              <Tooltip title={'Your account'}>
                <UserAccountPopover
                  componentsStore={componentsStore}
                  authContext={authContext}
                />
              </Tooltip>
            </Col>
            <Col span={1} />
          </Fragment>
          : <Fragment>
            <Col span={2}>
              <StyledDemoHeadingContainer
                onClick={() => authContext.setGuestMode(false)}
              >
                <StyledDemoHeading>
                  Exit demo
                </StyledDemoHeading>
              </StyledDemoHeadingContainer>
            </Col>
            <Col span={1} />
          </Fragment>
      }
      <Drawer
        title={<StyledHeading>Preferences</StyledHeading>}
        placement={'right'}
        width={360}
        closable={true}
        onClose={() => toggleRightDrawerVisible()}
        visible={componentsStore.rightDrawerVisible}
      >
        <RightDrawer />
      </Drawer>
    </Row>,
  );
};