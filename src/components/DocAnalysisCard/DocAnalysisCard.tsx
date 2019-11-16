import React, { Fragment, useContext, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Card, Collapse } from 'antd';
import styled from 'styled-components';

import info from '../../assets/icons/info.svg';

import WordCountModal from '../Modals/DocAnalysisModal/DocAnalysisModal';
import {
  StyledVisbyRegular,
} from '../common/StyledComponents';
import RxEditorContext from '../../stores/RxEditorContext';
import { getWordCount } from '../RxEditor/utils/utils';

const StyledWordCount = styled.div`
  user-select: none;
  margin: 12px;
  font-family: 'VisbyCF-Regular', sans-serif;
  color: grey;
`;

const StyledTitle = styled.span`
  font-family: 'VisbyCF-Bold', sans-serif;
  font-size: 18px;
  color: #4c4c4c;
`;

const StyledCardTitle = styled.span`
  font-family: 'VisbyCF-Bold', sans-serif;
  user-select: none;
  font-size: 22px;
`;

const StyledImage = styled.img``;

const { Panel } = Collapse;

export default () => {
  const editorStore = useContext(RxEditorContext);
  const {
    editorState,
    // lockEditor,
    unlockEditor,
    // lockScrolling,
    unlockScrolling,
  } = editorStore;

  const [visible, setVisible] = useState(false);

  const closeModalCallback = () => {
    setVisible(false);
    unlockEditor();
    unlockScrolling();
  };

  return useObserver(() =>
    <Fragment>
      <Card
        title={
          <StyledCardTitle>
            Doc Info&nbsp;<StyledImage src={info} />
          </StyledCardTitle>
        }
        // onClick={() => {
        //   setVisible(true);
        //   lockEditor();
        //   lockScrolling();
        // }}
      >
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
        >
          <Panel
            header={<StyledTitle>Footnotes</StyledTitle>}
            key="1"
          >
            <StyledVisbyRegular>
              Your footnotes will appear here.
            </StyledVisbyRegular>
          </Panel>
        </Collapse>
        <StyledWordCount>
          <StyledTitle>
            Word count:
          </StyledTitle>&nbsp;
          {`${getWordCount(editorState.current)}`}
        </StyledWordCount>
      </Card>
      <WordCountModal
        visible={visible}
        closeModal={closeModalCallback}
        editorState={editorState.current}
      />
    </Fragment>,
  );
}
