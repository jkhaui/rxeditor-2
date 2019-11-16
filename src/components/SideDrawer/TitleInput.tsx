import React from 'react';
import { Input } from 'antd';

interface IProps {
  placeholder: string;
  size: any;
  maxLength: number;
  lockEditor: () => void;
  unlockEditor: () => void;
  toggleTitleFocus: () => void;
}

export default ({ lockEditor, unlockEditor, toggleTitleFocus, ...rest }: IProps) =>
  <Input
    onClick={() => {
      lockEditor();
      toggleTitleFocus();
    }}
    onBlur={() => {
      unlockEditor();
      toggleTitleFocus();
    }}
    value={'Doc No. 16'}
    style={{
      fontSize: 24,
      height: 60,
    }}
    {...rest}
  />;
