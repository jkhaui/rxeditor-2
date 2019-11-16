import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { Row, Col, Tooltip, Drawer, Divider } from 'antd';

import undo from '../../assets/icons/undo.svg';
import redo from '../../assets/icons/redo.svg';
import keyboard from '../../assets/icons/keyboard.svg';
import gear from '../../assets/icons/gear.svg';

import { UndoRedoButton } from '../Buttons/UndoRedoButton';
import {
  REDO_PAYLOAD,
  REDO_SHORTCUT,
  UNDO_PAYLOAD,
  UNDO_SHORTCUT,
} from '../RxEditor/utils/constants';

import { StyledPopover } from '../common/StyledComponents';
import RxEditorContext from '../../stores/RxEditorContext';
import RightDrawer from '../RightDrawer/RightDrawer';
import ComponentsContext from '../../stores/ComponentsContext';
import { useObserver } from 'mobx-react-lite';

const StyledIcon = styled.img`
  cursor: pointer;
`;

const StyledHeading = styled.div`
  font-family: 'VisbyCF-Bold', sans-serif;
  font-size: 20px;
`;

const StyledText = styled.span`
  font-size: 18px;
`;

const StyledBoldText = styled(StyledText)`
    font-family: 'VisbyCF-Bold', sans-serif;
`;

const StyledRegularText = styled(StyledText)`
  font-family: 'VisbyCF-Regular', sans-serif;
`;

export default () => {
  const componentsStore = useContext(ComponentsContext);
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

  const handleVisibleChange = () => {
    toggleKeyboardShortcutsVisible();
    readOnlyState.locked ? unlockEditor() : lockEditor();
  };

  return useObserver(() =>
    <Row className={'TopPanel'}>
      <Col span={19} />
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
        <Tooltip
          title={'Keyboard shortcuts (Ctrl + K)'}
          placement={'left'}
        >
          <StyledPopover
            placement={'bottomRight'}
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
            visible={componentsStore.keyboardShortcutsVisible}
            onVisibleChange={handleVisibleChange}
            trigger="click"
          >
            <StyledIcon
              src={keyboard}
              width={42}
              height={'auto'}
            />
          </StyledPopover>
        </Tooltip>
      </Col>
      <Col
        span={1}
        style={{
          minWidth: 50,
        }}
      >
        <Tooltip
          title={'Preferences'}
        >
          <StyledIcon
            src={gear}
            width={42}
            height={'auto'}
            onClick={() => toggleRightDrawerVisible()}
          />
        </Tooltip>
      </Col>
      <Col span={1} />
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