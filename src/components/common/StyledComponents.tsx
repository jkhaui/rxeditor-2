import React from 'react';
import { Button, Popover } from 'antd';
import styled from 'styled-components';

import { CHELEVRA_THEME } from '../../utils/constants';

import { NativeButtonProps } from 'antd/lib/button/button';
import { IThemeProps } from '../../types/ui';

export const Container = styled.div`
  margin: 8px;
  border: 1px solid #03a9f4;
  
    .DraftEditor-root {
      padding: 8px;
    }
`;

export const StyledImage = styled.img``;

// export const LogoImage = styled(StyledImage)`
//   margin-top: -6px;
// `;
//
// export const InlineContainer = styled.div`
//   user-select: none;
// `;

// export const LogoContainer = styled(InlineContainer)`
//   padding-top: 10.5px;
// `;
//
// export const BoldText = styled.span`
//   font-weight: bold;
// `;

export const StyledVisbyRegular = styled.span`
  font-family: 'VisbyCF-Regular', sans-serif;
  white-space: normal;
  font-size: 18px;
`;

export const SuggestionItem = styled(Container)`
  cursor: pointer !important;
`;

export const StyledButton = styled(
  (props: NativeButtonProps) => <Button {...props} />,
)``;

export const StyledThemedButton = styled(StyledButton)`
      .--active {
        opacity: 0.5;
      }
    background-color: ${(props: IThemeProps) => (
  props.theme.active === CHELEVRA_THEME
    ? '#82b1ff !important'
    : '#e0f7fa !important'
)};
`;

export const StyledPopover = styled(Popover)`
  .ant-popover-content {
    user-select: none;
    font-family: 'VisbyCF-Bold', sans-serif !important;
  }
`;

export const StyledContainer = styled.div`
  user-select: none;
  font-family: 'VisbyCF-Bold', sans-serif !important;
`;

const StyledText = styled.span`
  font-size: 18px;
`;

export const StyledBoldText = styled(StyledText)`
    font-family: 'VisbyCF-Bold', sans-serif;
`;

export const StyledRegularText = styled(StyledText)`
  font-family: 'VisbyCF-Regular', sans-serif;
`;

export const StyledHeading = styled.div`
  font-family: 'VisbyCF-Bold', sans-serif;
  font-size: 20px;
`;

export const StyledIcon = styled.img`
  cursor: pointer;
  user-select: none;
`;

export const StyledLink = styled.a`
  color: #2EC4B6;
  transition: 0.5s;
  
    &:hover {
      opacity: 0.7;
    }
`;