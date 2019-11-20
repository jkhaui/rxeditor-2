import React, { Fragment, useContext, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Card } from 'antd';
import styled from 'styled-components';

import LoginWrapper from './LoginWrapper';
import { StyledBoldText } from '../common/StyledComponents';
import Loading from '../common/Loading';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import './Login.css';

const cardTabs = [
  {
    key: 'loginTab',
    tab: 'Log in',
  },
  {
    key: 'signUpTab',
    tab: 'Sign up',
  },
];

const tabContent: { [tab: string]: JSX.Element } = {
  loginTab: <LoginWrapper />,
  signUpTab: <p>Sign Up</p>,
};

const StyledAction: any = styled.span`
  cursor: pointer;
  color: #13c2c2;
  transition: 0.5s;
  
    &:hover {
      opacity: 0.7;
    }
`;

export default () => {
  const authContext = useContext(AuthenticationContext);
  const { setGuestMode } = authContext;

  const [activeTab, setActiveTab] = useState('loginTab');
  const [loading, setLoading] = useState(false);

  const onTabChange = (key: string): void => setActiveTab(key);

  return useObserver(() =>
    <Card
      style={{
        maxWidth: 540,
        minWidth: 337,
        marginTop: '9vH',
      }}
      tabList={cardTabs}
      activeTabKey={activeTab}
      onTabChange={onTabChange}
      tabBarExtraContent={
        <StyledBoldText>
          ...or&nbsp;
          <StyledAction onMouseDown={() => {
            setLoading(true);
            // `setTimeout` lets the loading icon display in case of delayed
            // rendering.
            setTimeout(() => setGuestMode(true), 500);
          }}>
            try without an account
          </StyledAction>
        </StyledBoldText>
      }
    >
      {
        !loading
          ? <Fragment>
            {tabContent[activeTab]}
          </Fragment>
          : <Loading />
      }
    </Card>,
  );
}