import React from 'react';
import styled from 'styled-components';
import { StyledContainer, StyledImage } from './StyledComponents';

import guest_loading from '../../assets/icons/guest-loading.svg';

const StyledLoadingContainer = styled(StyledContainer)`
  text-align: center;
`;

export default () =>
  <StyledLoadingContainer>
    <StyledImage src={guest_loading} />
  </StyledLoadingContainer>