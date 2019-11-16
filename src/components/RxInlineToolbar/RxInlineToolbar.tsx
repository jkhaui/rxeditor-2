import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import { InlineStyleButton } from '../Buttons/InlineStyleButton';
import {
  BOLD_PAYLOAD,
  BOLD_SHORTCUT,
  COPY_PAYLOAD,
  COPY_SHORTCUT,
  CUT_PAYLOAD,
  HIGHLIGHT_PAYLOAD,
  HIGHLIGHT_SHORTCUT,
  ITALIC_PAYLOAD,
  ITALIC_SHORTCUT,
  UNDERLINE_PAYLOAD,
  UNDERLINE_SHORTCUT,
} from '../RxEditor/utils/constants';

import italic from '../../assets/icons/italic.svg';
import bold from '../../assets/icons/bold.svg';
import underline from '../../assets/icons/underline.svg';
import { ColorButton } from '../Buttons/ColorButton';
import highlight from '../../assets/icons/highlight.svg';
import { UtilButton } from '../Buttons/UtilButton';
import cut from '../../assets/icons/cut.svg';
import copy from '../../assets/icons/copy.svg';

import './RxInlineToolbar.css';

const { Group } = Button;

const StyledButtonGroup = styled.div`
  display: inline-flex;
  margin: 0 8px 0 8px;
`;

export default ({ InlineToolbar, LinkButton }: any) =>
  <InlineToolbar>
    {(externalProps: any) => (
      <Fragment>
        <StyledButtonGroup>
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
        </StyledButtonGroup>
        <StyledButtonGroup>
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
        </StyledButtonGroup>
        <StyledButtonGroup>
          <ColorButton
            icon={highlight}
            command={HIGHLIGHT_PAYLOAD}
            shortcut={HIGHLIGHT_SHORTCUT}
          />
          <LinkButton {...externalProps} />
        </StyledButtonGroup>
      </Fragment>
    )}
  </InlineToolbar>;