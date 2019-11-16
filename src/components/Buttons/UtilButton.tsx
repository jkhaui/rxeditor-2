import React from 'react';
import { notification, Tooltip, Button } from 'antd';

import { StyledImage } from '../common/StyledComponents';
//import { COPY_PAYLOAD } from '../utils/constants';

export const UtilButton = ({ command, shortcut, icon }: any) =>
  <Tooltip
    title={
      shortcut
        ? `${command.charAt(0) + command
          .substr(1)
          .toLowerCase()} (${shortcut})`
        : command.charAt(0) + command
        .substr(1)
        .toLowerCase()
    }
  >
    <Button
      ghost
      type="link"
      onMouseDown={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        notification.open({
          message: 'Copied',
          style: {
            zIndex: 999,
          },
          duration: 5,
          placement: 'bottomRight',
          icon: '',
        });
      }}
    >
      <StyledImage src={icon} width="22" height="22" />
    </Button>
  </Tooltip>;
