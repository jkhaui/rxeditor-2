import React, { /*useState, Fragment*/ } from 'react';
// import { useSubscription } from 'observable-hooks';
import { Modal } from 'antd';
import styled from 'styled-components';

// import { sampleText } from '../RxEditor/utils/constants';
//
// import { keywords$ } from '../../services/keywords.service';
import { getWordCount } from '../../RxEditor/utils/utils';

const StyledModalWrapper = styled.div`
  font-family: 'VisbyCF-Regular', sans-serif;
`;

const StyledModalHeader = styled.div`
  user-select: none;
  font-family: 'VisbyCF-Bold', sans-serif;
`;

const StyledTextVisbyBold = styled.span`
  font-family: 'VisbyCF-Bold', sans-serif;
`;

export default ({ visible, closeModal, editorState }: any) => {
  // const [keywords, setKeywords] = useState();
  //
  // const getKeywords$ = useSubscription(
  //   keywords$(sampleText),
  //   ({ key_terms }: any) => setKeywords(Object.keys(key_terms)),
  //   null,
  //   () => console.log('Complete'),
  // );
  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title={
        <StyledModalHeader>
          Document Analysis
        </StyledModalHeader>
      }
      footer={null}
    >
      <StyledModalWrapper
        onContextMenu={e => e.preventDefault()}
      >
        <p>
          <StyledTextVisbyBold>
            Total Words:
          </StyledTextVisbyBold> {`${getWordCount(editorState)}`}
        </p>
        <p>
          <StyledTextVisbyBold>
            Total Characters:
          </StyledTextVisbyBold> {
          `${editorState.getCurrentContent().getPlainText().length}`
        }
        </p>
        {/*} <p>
          <StyledTextVisbyBold>Keywords:</StyledTextVisbyBold> {
          keywords
            ? keywords.map((keyword: React.ReactNode, index: number) =>
              index !== keywords.length
                ? <Fragment key={index}>
                  {keyword},&nbsp;
                </Fragment>
                : <Fragment key={index}>
                  {keyword}
                </Fragment>,
            )
            : 'Keyword extraction will be performed when there\'s more text' +
            ' to analyse'
        }</p>*/}
      </StyledModalWrapper>
    </Modal>
  );
}
