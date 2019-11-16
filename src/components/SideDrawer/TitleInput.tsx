import React from 'react';
import { Input } from 'antd';

export default (props: any) => {
  const {
    placeholder,
    size,
    maxLength,
    lockEditor,
    unlockEditor,
    toggleTitleFocusState,
  } = props;

  return (
    <Input
      onClick={() => {
        lockEditor();
        toggleTitleFocusState();
      }}
      onBlur={() => {
        unlockEditor();
        toggleTitleFocusState();
      }}
      placeholder={placeholder}
      size={size}
      maxLength={maxLength}
      value={'Doc No. 16'}
      style={{
        fontSize: 24,
        height: 60,
      }}
    />
  );
}
