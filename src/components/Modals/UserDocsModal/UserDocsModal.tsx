import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Modal } from 'antd';
import styled from 'styled-components';

import UserDocsList from './UserDocsList';

import RxEditorContext from '../../../contexts/RxEditorContext';

const StyledModalWrapper = styled.div`
  font-family: 'VisbyCF-Regular', sans-serif;
`;

const StyledModalHeader = styled.div`
  user-select: none;
  font-family: 'VisbyCF-Bold', sans-serif;
`;

export default () => {
  const editorStore = useContext(RxEditorContext);
  const {
    savedDocsModalState,
    toggleSavedDocsModalState,
  } = editorStore;

  return useObserver(() => (
      <Modal
        visible={savedDocsModalState.isOpen}
        onCancel={toggleSavedDocsModalState}
        title={
          <StyledModalHeader>
            Saved Documents
          </StyledModalHeader>
        }
        footer={null}
      >
        <StyledModalWrapper
          onContextMenu={e => e.preventDefault()}
        >
          <UserDocsList handleCancel={toggleSavedDocsModalState} />
        </StyledModalWrapper>
      </Modal>
    ),
  );
}
