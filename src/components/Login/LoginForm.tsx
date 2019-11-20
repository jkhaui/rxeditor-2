import React, { useContext, useState } from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Form, Icon, Input } from 'antd';

import { AUTH_TOKEN } from '../../graphql/constants';

import Loading from '../common/Loading';
import { StyledLink } from '../common/StyledComponents';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import { IAuthResult } from '../../types/auth';
import { NativeButtonProps } from 'antd/lib/button/button';

const { Item } = Form;

const StyledButton = styled(
  (props: NativeButtonProps) => <Button {...props} />,
)`
  width: 100%;
  min-height: 58.88px !important;
  border-radius: 2px !important;
  background-color: #2EC4B6 !important;
  color: #FFF !important;
`;

// TODO: Create proper schema
const LOGIN_USER = gql`
  mutation loginMutation($username: String!, $password: String!) {
    login(input: {
      username: $username
      password: $password
      clientMutationId: ""
    }) {
      authToken
      user {
        id
      }
    }
  }
`;

export default ({ getFieldDecorator }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authenticationContext = useContext(AuthenticationContext);
  const { refreshTokenFn } = authenticationContext;

  const client = useApolloClient();
  const [loginMutation, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted ({ login: { authToken } }: any) {
        localStorage.setItem(AUTH_TOKEN, authToken);
        client.writeData({ data: { isLoggedIn: true } });
      },
    },
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Please re-check your credentials.</p>;
  }

  return (
    <Form>
      <Item>
        {getFieldDecorator('username', {
          rules: [{
            required: true,
            message: 'Please enter your username',
          }],
        })(
          <Input
            size={'large'}
            className={'Auth-usernameField'}
            prefix={
              <Icon
                type={'user'}
                style={{
                  color: 'rgba(0,0,0,.25)',
                }}
              />
            }
            placeholder={'Username'}
            onChange={({ target: { value } }) => setUsername(value)}
          />,
        )}
      </Item>
      <Item>
        {getFieldDecorator('password', {
          rules: [{
            required: true,
            message: 'Please enter your password',
          }],
        })(
          <Input
            size={'large'}
            className={'Auth-passwordField'}
            prefix={
              <Icon
                type={'lock'}
                style={{
                  color: 'rgba(0,0,0,.25)',
                }}
              />
            }
            type={'password'}
            autoComplete={'current-password'}
            placeholder={'Password'}
            onChange={({ target: { value } }) => setPassword(value)}
          />,
        )}
      </Item>
      <StyledButton
        onClick={() => login(
          loginMutation,
          refreshTokenFn,
          username,
          password,
        )}
        size={'large'}
        htmlType={'submit'}
        className={'login-form-button'}
      >
        Log in
      </StyledButton>
      <Item className={'Auth-rowMeta'}>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>Remember me</Checkbox>)}
        <StyledLink
          className="login-form-forgot"
          href=""
        >
          Forgot password
        </StyledLink>
      </Item>
    </Form>
  );
}

async function login (
  loginMutation: any,
  refreshTokenFn: (x: any) => void,
  username: string,
  password: string,
) {
  loginMutation({
    variables: {
      username,
      password,
    },
  })
    .then((response: IAuthResult) => {
      const token = response.data.login.authToken;

      refreshTokenFn && refreshTokenFn({
        [AUTH_TOKEN]: token,
      });
      // window.location.reload();
    })
    .catch((error: string) => console.log(error));
}