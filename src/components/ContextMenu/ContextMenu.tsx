import React, { useContext } from 'react';
import { Menu, Row, Col } from 'antd';
// import styled from 'styled-components';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useObserver } from 'mobx-react-lite';

import {
  CREATE_FOOTNOTE_POINTER_ACTION,
  CREATE_LINK_ACTION,
  RXEDITOR_CONTEXTMENU,
} from '../RxEditor/utils/constants';

import contextmenu_copy
  from '../../assets/icons/contextmenu/contextmenu-copy.svg';
import contextmenu_cut
  from '../../assets/icons/contextmenu/contextmenu-cut.svg';
import contextmenu_paste
  from '../../assets/icons/contextmenu/contextmenu-paste.svg';
import superscript
  from '../../assets/icons/superscript.svg';
import link from '../../assets/icons/link.svg';

import RxEditorContext from '../../stores/RxEditorContext';
import { StyledImage } from '../common/StyledComponents';
import {
  copyToClipboard,
  deleteSelectedText,
  selectAllText,
} from '../RxEditor/utils/utils';
import { createEntity } from '../../actions';
import FootnoteContext from '../../stores/FootnoteContext';

const { Item } = Menu;

export const RxEditorContextMenu = () => {
  const editorStore = useContext(RxEditorContext);
  const footnoteStore = useContext(FootnoteContext);
  const {
    editorState,
    editorState$,
    lockEditor,
    unlockEditor,
    lockScrolling,
    unlockScrolling,
    onFocus,
    onBlur,
    dispatch,
    // isFocused,
  } = editorStore;

  return useObserver(() =>
    <ContextMenu
      id={RXEDITOR_CONTEXTMENU}
      onShow={() => {
        lockEditor();
        lockScrolling();
        onBlur();
      }}
      onHide={() => {
        unlockEditor();
        unlockScrolling();
        onFocus();
      }}
    >
      <Menu>
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-Cut'}
          // Note that we can't store the properties of `editorState` as
          // variables, otherwise MobX will not read their latest values.
          disabled={editorState.current.getSelection().isCollapsed()}
        >
          <MenuItem>
            <Row>
              <Col span={3}>
                <StyledImage src={contextmenu_cut} />
              </Col>
              <Col span={9}>
                Cut
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-Copy'}
          disabled={editorState.current.getSelection().isCollapsed()}
        >
          <MenuItem
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onFocus();
              copyToClipboard(editorState.current);
            }}>
            <Row>
              <Col span={3}>
                <StyledImage src={contextmenu_copy} />
              </Col>
              <Col span={9}>
                Copy
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-Paste'}
        >
          <MenuItem onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onFocus();
          }}>
            <Row>
              <Col span={3}>
                <StyledImage src={contextmenu_paste} />
              </Col>
              <Col span={9}>
                Paste
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-Delete'}
          disabled={editorState.current.getSelection().isCollapsed()}
        >
          <MenuItem onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!editorState.current.getSelection().isCollapsed()) {
              return;
            }
            onFocus();
            deleteSelectedText(editorState.current, editorState$);
          }}>
            <Row>
              <Col span={3} />
              <Col span={9}>
                Delete
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <MenuItem divider />
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-Link'}
        >
          <MenuItem onClick={createEntity(
            dispatch,
            CREATE_LINK_ACTION,
            'https://google.com',
          )}>
            <Row>
              <Col span={3}>
                <StyledImage src={link} />
              </Col>
              <Col span={9}>
                Link
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <MenuItem divider />
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-insertFootnote'}
        >
          <MenuItem onClick={createEntity(
            dispatch,
            CREATE_FOOTNOTE_POINTER_ACTION,
            footnoteStore.count,
          )}>
            <Row>
              <Col span={3}>
                <StyledImage src={superscript} />
              </Col>
              <Col span={9}>
                Insert footnote
              </Col>
            </Row>
          </MenuItem>
        </Item>
        <MenuItem divider />
        <Item
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          key={'RxEditor-contextMenu-SelectAll'}
        >
          <MenuItem onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            selectAllText(editorState.current, editorState$);
          }}>
            <Row>
              <Col span={3}>
              </Col>
              <Col span={9}>
                Select all
              </Col>
            </Row>
          </MenuItem>
        </Item>
      </Menu>
    </ContextMenu>,
  );
};
