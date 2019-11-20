import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';

import LoginCard from './LoginCard';

const LoginPageWrapper = styled.div`
  height: 100vH;
  width: 100vW;
  background-color: #eceff1;
`;

export default () =>
  <LoginPageWrapper>
    <Row />
    <Row>
      <Col span={12} offset={1}>
        <LoginCard />
      </Col>
      <Col span={6} />
      <Col span={6} />
    </Row>
  </LoginPageWrapper>;