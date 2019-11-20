import React from 'react';
import { Col, Collapse, Form, Row } from 'antd';
import FacebookLogin from 'react-facebook-login';

import { FACEBOOK_CLIENT_AUTH_ID } from '../../utils/constants';

import LoginForm from './LoginForm';
import { authResponseFacebook } from '../../services/auth';

const { Panel } = Collapse;

const LoginWrapperInner = ({ form: { getFieldDecorator } }: any) =>
  <Row>
    <Col span={2} />
    <Col span={20}>
      <br />
      <FacebookLogin
        icon={'fa-facebook'}
        appId={FACEBOOK_CLIENT_AUTH_ID}
        textButton="Log in with Facebook"
        fields="name,email,picture"
        callback={authResponseFacebook}
      />
      <br />
      <br />
      <Collapse defaultActiveKey={['']} className={'Auth-Panel'}>
        <Panel
          key={1}
          showArrow={false}
          header={'Log in with email and password'}
          className={'Auth-collapsePanel'}
        >
          <LoginForm getFieldDecorator={getFieldDecorator} />
        </Panel>
      </Collapse>
      <br />
    </Col>
    <Col span={2} />
  </Row>;

const LoginWrapper = Form.create({
  name: 'login_form',
})(LoginWrapperInner);

export default LoginWrapper;