import React, { forwardRef, useState } from 'react';
import { when } from 'mobx';
import Measure from 'react-measure';
import styled from 'styled-components';
import { Editor, EditorState } from 'draft-js';

import { RXEDITOR_FOOTNOTE_DIVIDER, RXEDITOR_PAGE } from './utils/constants';

// import { randomId } from '../../utils/utils';
import { addNewPage } from '../../core/layout';

import { ContentRect } from '../../types/rxEditor';
import { BehaviorSubject } from 'rxjs';

export const PageElement = styled.div`
  width: 816px;
`;

export const PageContentElement = styled(PageElement)`
`;

const OuterWrapper = styled(PageElement)`
  position: relative;
  margin-top: 96px;
  height: 960px;
`;

const InnerWrapper = styled(PageElement)`
  position: absolute;
  cursor: text;
  height: 864px;
`;

const FootnoteContainer = styled(PageElement)`
  min-height: 30.5px;
  margin-left: 96px;
  margin-right: 96px;
  position: absolute;
  bottom: 0;
  width: inherit;
`;

const FootnoteContainerDivider = styled.div`
  width: 192px;
  border-top: 1pt solid #000;
  height: 0;
  margin: 5pt 0;
`;

// const FootnoteEditableArea = styled.div`
// `;

const PageContainer = styled(PageElement)`    
    .public-DraftStyleDefault-block {
        margin-left: 96px;
        margin-right: 96px;
    }
    
  //caret-color: transparent;
  height: 1056px;
  color: #303030;
  cursor: default;
  box-shadow: rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
  font-family: Calibri, sans-serif;
  font-size: 14.666666666666666px;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none;
  vertical-align: baseline;
  position: relative;
  overflow: hidden;
  border: 0;
  margin: 10px 30px 0 0;
  background-color: #FFF;
`;

interface IProps {
  children?: any;
  editorState: EditorState;
  editorState$: BehaviorSubject<EditorState>;
  footnotesActive: boolean;
  onFocus: () => void;
}

export default forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [footnoteState, setFootnoteState] = useState(
    EditorState.createEmpty(),
  );

  const {
    children,
    editorState,
    editorState$,
    footnotesActive,
    onFocus,
  } = props;

  return (
    <PageContainer
      className={RXEDITOR_PAGE}
      onClick={() => onFocus()}
    >
      <OuterWrapper>
        <InnerWrapper
          ref={ref}
          className={'RxEditor-pageWrapper'}
        >
          <Measure
            bounds
            onResize={(contentRect: ContentRect): void => {
              const { bounds } = contentRect;
              const { height } = bounds;

              when(
                () => height > 844,
                () => addNewPage(
                  editorState,
                  editorState$,
                  children[children.length - 1].key,
                ),
              );
            }}
          >
            {({ measureRef }) => (
              <PageContentElement ref={measureRef}>
                {children}
                {
                  footnotesActive
                    ? <FootnoteContainer>
                      <FootnoteContainerDivider
                        className={RXEDITOR_FOOTNOTE_DIVIDER}
                      />
                      {/* TODO: Plan is to "lock" the main editor while a
                       footnote container is focused.
                       E.g. https://github.com/peritext/scholar-draft
                       */}
                      <Editor
                        editorState={footnoteState}
                        onChange={setFootnoteState}
                      />
                    </FootnoteContainer>
                    : null
                }
              </PageContentElement>
            )}
          </Measure>
        </InnerWrapper>
      </OuterWrapper>
    </PageContainer>
  );
});
