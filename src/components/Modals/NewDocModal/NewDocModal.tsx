import React, { useContext } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Modal, Input, Button } from 'antd';
import styled from 'styled-components';
import RxEditorContext from '../../../contexts/RxEditorContext';

const StyledModalWrapper = styled.div`
  font-family: 'VisbyCF-Regular', sans-serif;
`;

const StyledModalHeader = styled.div`
  user-select: none;
  font-family: 'VisbyCF-Bold', sans-serif;
`;

const StyledModalFooter = styled.div`
`;

export default () => {
  const editorStore = useContext(RxEditorContext);
  const {
    newDocModalState,
    toggleNewDocModalState,
  } = editorStore;

  return useObserver(() =>
    <Modal
      visible={newDocModalState.isOpen}
      onCancel={toggleNewDocModalState}
      onOk={toggleNewDocModalState}
      title={
        <StyledModalHeader>
          New Document
        </StyledModalHeader>
      }
      footer={
        <StyledModalFooter>
          <Button
            onClick={toggleNewDocModalState}
            size={'large'}
          >
            Cancel
          </Button>
          <Button
            onClick={toggleNewDocModalState}
            size={'large'}
            type={'primary'}
          >
            OK
          </Button>
        </StyledModalFooter>
      }
    >
      <StyledModalWrapper
        onContextMenu={e => e.preventDefault()}
      >
        <Input
          size={'large'}
          placeholder={'Document Title'}
          onPressEnter={toggleNewDocModalState}
          maxLength={100}
        />
      </StyledModalWrapper>
    </Modal>,
  );
}
