import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const StyledFootnotePointer: any = styled.sup`
  cursor: pointer;
    
    &:hover {
      color: white;
      background-color: deepskyblue;
      transition: 0.2s;
    }
`;

export default ({ children }: any) =>
  <Tooltip
    title={'Footnote Info'}
  >
    <StyledFootnotePointer
      contentEditable={false}
    >
      {children}
    </StyledFootnotePointer>
  </Tooltip>;
