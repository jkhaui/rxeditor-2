import { useObserver } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Tooltip, Modal } from 'antd';
// import download from 'downloadjs';

import RxEditorContext from '../../stores/RxEditorContext';

import { StyledThemedButton, StyledImage } from '../common/StyledComponents';

export const DownloadButton = ({ icon, shortcut }: any) => {
  const editorStore = useContext(RxEditorContext);
  const { toggleDownloadDocModalState, downloadDocModalState } = editorStore;

  return useObserver(() =>
    <Fragment>
      <Tooltip title={`Download (${shortcut})`}>
        <StyledThemedButton
          onMouseDown={() => toggleDownloadDocModalState()}
        >
          <StyledImage src={icon} width="18" height="18" />
        </StyledThemedButton>
      </Tooltip>
      <Modal
        title={'Download'}
        visible={downloadDocModalState.isOpen}
        onOk={() => toggleDownloadDocModalState()}
        onCancel={() => toggleDownloadDocModalState()}
      >
        Enter file name:
      </Modal>
    </Fragment>,
  );
};
