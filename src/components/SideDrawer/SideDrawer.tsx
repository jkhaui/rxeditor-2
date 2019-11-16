import React, { Fragment, useContext } from 'react';
import { Drawer, Tooltip, Row, Col, Divider } from 'antd';
import styled from 'styled-components';

import {
  RXEDITOR_SIDEDRAWER,
  SUPERSCRIPT_PAYLOAD,
} from '../RxEditor/utils/constants';
import { CHELEVRA_THEME } from '../../utils/constants';

import folder from '../../assets/icons/folder.svg';
import print from '../../assets/icons/print.svg';
import pen from '../../assets/icons/pen.svg';
import menu_more from '../../assets/icons/menu-more.svg';
import superscript from '../../assets/icons/superscript.svg';
// import footnote_list from '../../assets/icons/footnote-list.svg';

import RxEditorContext from '../../stores/RxEditorContext';
import NewDocModal from '../Modals/NewDocModal/NewDocModal';
import UserDocsModal from '../Modals/UserDocsModal/UserDocsModal';
import TitleInput from './TitleInput';
import DocAnalysisCard from '../DocAnalysisCard/DocAnalysisCard';

import {
  StyledPopover,
  StyledThemedButton,
} from '../common/StyledComponents';
import { FootnoteButton } from '../Buttons/FootnoteButton';

import { IThemeProps } from '../../types/ui';

const StyledDrawer = styled(Drawer)`
  height: 100%;
  width: 100%;
  
    .ant-drawer-content {
      height: 100%;
      width: 100%;
      padding-top: 12px;
      background-color: ${(props: IThemeProps) => (
  props.theme.active === CHELEVRA_THEME
    ? '#333'
    : '#F3F3F3'
)}
    }
    
    .ant-drawer-body {
      padding: 16px;
    }
    
    .ant-input:placeholder-shown {
      font-family: 'VisbyCF-Regular', sans-serif;
    }
    
    .NewDoc-Btn {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    
    .SavedDocs-Btn {
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }
`;

const StyledWrapper = styled.div`
  width: 240px;
`;
const StyledImage = styled.img`
  user-select: none;
`;
const StyledMenuIcon = styled(StyledImage)`
  cursor: pointer;
  padding-top: 4px;
  margin-left: 24px;
`;
const StyledItem = styled.div`
  cursor: pointer;
  font-family: 'VisbyCF-Bold', sans-serif;
  font-size: 18px;
  margin-right: 18px;
  user-select: none;
`;

export default () => {
  const editorStore = useContext(RxEditorContext);
  const {
    toggleSavedDocsModalState,
    toggleNewDocModalState,
    titleFocusState,
    toggleTitleFocusState,
    lockEditor,
    unlockEditor,
  } = editorStore;

  return (
    <Fragment>
      <StyledDrawer
        className={RXEDITOR_SIDEDRAWER}
        placement={'left'}
        closable={false}
        mask={false}
        visible={true}
        width={260}
        zIndex={9}
      >
        <Row>
          <Col span={24}>
            <TitleInput
              placeholder={'Document Title'}
              size={'large'}
              titleFocusState={titleFocusState}
              toggleTitleFocusState={toggleTitleFocusState}
              maxLength={100}
              lockEditor={lockEditor}
              unlockEditor={unlockEditor}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <Tooltip title={'New Document (Ctrl + D)'}>
              <StyledThemedButton
                block
                className={'NewDoc-Btn'}
                size={'large'}
                onClick={toggleNewDocModalState}
                style={{
                  height: 50,
                }}
              >
                <StyledImage
                  src={pen}
                  width={28}
                  height={'auto'}
                />
              </StyledThemedButton>
            </Tooltip>
            <br />
            <Tooltip title={'Saved Documents (Ctrl + O)'}>
              <StyledThemedButton
                block
                className={'SavedDocs-Btn'}
                size={'large'}
                onClick={toggleSavedDocsModalState}
                style={{
                  height: 50,
                }}
              >
                <StyledImage
                  src={folder}
                  width={28}
                  height={'auto'}
                />
              </StyledThemedButton>
            </Tooltip>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <FootnoteButton
              icon={superscript}
              command={SUPERSCRIPT_PAYLOAD}
              shortcut={'Ctrl + /'}
            />
          </Col>
        </Row>
        <br />
        <DocAnalysisCard />
        <Row>
          <Col span={16} />
          <Col span={8}>
            <StyledPopover
              content={
                <StyledWrapper>
                  <Row>
                    <Col span={8}>

                    </Col>
                    <Col span={16}>
                      <StyledItem>Export to Word</StyledItem>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={8}>

                    </Col>
                    <Col
                      span={16}
                    >
                      <StyledItem>Export to PDF</StyledItem>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={8}>
                      <StyledImage src={print} width={42} />
                    </Col>
                    <Col span={16}>
                      <StyledItem>Print</StyledItem>
                    </Col>
                  </Row>
                </StyledWrapper>
              }
              placement={'topLeft'}
              arrowPointAtCenter
            >
              <StyledMenuIcon
                src={menu_more}
                width={42}
                height={'auto'}
              />
            </StyledPopover>
          </Col>
        </Row>
      </StyledDrawer>
      <NewDocModal />
      <UserDocsModal />
    </Fragment>
  );
};
