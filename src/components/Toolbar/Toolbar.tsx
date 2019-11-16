import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import bold from '../../assets/icons/bold.svg';
import copy from '../../assets/icons/copy.svg';
import cut from '../../assets/icons/cut.svg';
import download from '../../assets/icons/download.svg';
import highlight from '../../assets/icons/highlight.svg';
import italic from '../../assets/icons/italic.svg';
import print from '../../assets/icons/print.svg';
import redo from '../../assets/icons/redo.svg';
import subscript from '../../assets/icons/subscript.svg';
import superscript from '../../assets/icons/superscript.svg';
import underline from '../../assets/icons/underline.svg';
import link from '../../assets/icons/link.svg';
import undo from '../../assets/icons/undo.svg';
import rxeditor_logo from '../../assets/rxEditorLogo.png';

import { CHELEVRA_THEME } from '../../utils/constants';

import { LogoContainer, LogoImage } from '../common/StyledComponents';
import { ColorButton } from '../Buttons/ColorButton';
import { DownloadButton } from '../Buttons/DownloadButton';
import { FootnoteButton } from '../Buttons/FootnoteButton';
import { LinkButton } from '../Buttons/LinkButton';
import { InlineStyleButton } from '../Buttons/InlineStyleButton';
import { UndoRedoButton } from '../Buttons/UndoRedoButton';
import { UtilButton } from '../Buttons/UtilButton';
import {
  BOLD_PAYLOAD,
  BOLD_SHORTCUT,
  COPY_PAYLOAD,
  COPY_SHORTCUT,
  CUT_PAYLOAD,
  HIGHLIGHT_PAYLOAD,
  HIGHLIGHT_SHORTCUT,
  ITALIC_PAYLOAD,
  ITALIC_SHORTCUT, LINK_SHORTCUT,
  PRINT_PAYLOAD,
  PRINT_SHORTCUT,
  REDO_PAYLOAD,
  REDO_SHORTCUT,
  RXEDITOR_TOOLBAR,
  // STRIKETHROUGH_PAYLOAD,
  SUBSCRIPT_PAYLOAD,
  SUPERSCRIPT_PAYLOAD,
  UNDERLINE_PAYLOAD,
  UNDERLINE_SHORTCUT,
  UNDO_PAYLOAD,
  UNDO_SHORTCUT,
} from '../RxEditor/utils/constants';

import 'antd/dist/antd.css';

const StyledToolbar = styled.div`
  display: block;
  padding: 4px 12px 4px 12px;
  position: fixed;
  z-index: 99;
  width: 100%;
  min-height: 52px;
  min-width: 1150px;
  background: ${props =>
  props.theme.active === CHELEVRA_THEME
    ? '#252526'
    : '#F3F3F3'};
  color: ${props =>
  props.theme.active === CHELEVRA_THEME
    ? '#F5F1F2'
    : '#323332'
};
  font-weight: 700;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  `;

const ToolbarGroup = styled.div`
  display: inline-flex;
  margin: 0 12px 0 12px;
`;

const ButtonGroups = styled.div`
  display: inline-flex;
  margin-left: 96px;
`;

const { Group } = Button;

export default () =>
  <StyledToolbar className={RXEDITOR_TOOLBAR}>
    <ToolbarGroup>
      <LogoContainer>
        <LogoImage src={rxeditor_logo} />
      </LogoContainer>
    </ToolbarGroup>
    <ButtonGroups>
      <Group>
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
      </Group>
      <ToolbarGroup>
        <UtilButton
          icon={print}
          command={PRINT_PAYLOAD}
          shortcut={PRINT_SHORTCUT}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <Group>
          <InlineStyleButton
            icon={bold}
            command={BOLD_PAYLOAD}
            shortcut={BOLD_SHORTCUT}
          />
          <InlineStyleButton
            icon={italic}
            command={ITALIC_PAYLOAD}
            shortcut={ITALIC_SHORTCUT}
          />
          <InlineStyleButton
            icon={underline}
            command={UNDERLINE_PAYLOAD}
            shortcut={UNDERLINE_SHORTCUT}
          />
        </Group>
      </ToolbarGroup>
      <ToolbarGroup>
        <FootnoteButton
          icon={superscript}
          command={SUPERSCRIPT_PAYLOAD}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <ColorButton
          icon={highlight}
          command={HIGHLIGHT_PAYLOAD}
          shortcut={HIGHLIGHT_SHORTCUT}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <LinkButton
          icon={link}
          shortcut={LINK_SHORTCUT}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <Group>
          <UtilButton
            icon={cut}
            command={CUT_PAYLOAD}
          />
          <UtilButton
            icon={copy}
            command={COPY_PAYLOAD}
            shortcut={COPY_SHORTCUT}
          />
        </Group>
      </ToolbarGroup>
      <ToolbarGroup>
        <DownloadButton
          icon={download}
          shortcut={'Ctrl + S'}
          onClick={() => {
          }}
        />
      </ToolbarGroup>
    </ButtonGroups>
  </StyledToolbar>;
