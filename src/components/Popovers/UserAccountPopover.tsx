import React, { Fragment } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Divider } from 'antd';
import styled from 'styled-components';

import {
  StyledHeading,
  StyledIcon,
  StyledPopover,
  StyledRegularText,
} from '../common/StyledComponents';
import user from '../../assets/icons/user.svg';
import { AUTH_TOKEN } from '../../graphql/constants';

const StyledAction = styled(StyledRegularText)`
  cursor: pointer;
`;

export default ({ componentsStore, authContext }: any) =>
  useObserver(() =>
    <StyledPopover
      visible={componentsStore.accountMenuVisible}
      onVisibleChange={() => (componentsStore.toggleAccountMenuVisible())}
      trigger={'hover'}
      placement={'bottomRight'}
      content={
        <Fragment>
          <StyledHeading>
            My Account
          </StyledHeading>
          <br />
          <Divider />
          <StyledAction
            onClick={() => {
              authContext.refreshTokenFn &&
              authContext.refreshTokenFn({
                [AUTH_TOKEN]: null,
              });
              authContext.setGuestMode(false);
            }}
          >
            Logout
          </StyledAction>
          <br />
        </Fragment>
      }
    >
      <StyledIcon
        src={user}
        width={42}
        height={'auto'}
      />
    </StyledPopover>,
  );