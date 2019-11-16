import React, { useContext } from 'react';
import { Select, Tooltip } from 'antd';
import styled from 'styled-components';

import RxEditorContext from '../../stores/RxEditorContext';
import ThemeContext from '../../stores/ThemeContext';
import {
  CABO_LIGHT_THEME,
  CHELEVRA_THEME,
  VISBY_REGULAR,
} from '../../utils/constants';

import { CoreThemes, ExtraThemes } from '../../types/ui';

const SelectContainer = styled.div`
  width: 100%;
  display: inline-block;
`;

const OptionText = styled.span`
  font-family: ${VISBY_REGULAR}, sans-serif;
`;

export default () => {
  const themeContext = useContext(ThemeContext);
  const editorContext = useContext(RxEditorContext);
  const { lockEditor, unlockEditor } = editorContext;

  const { Option } = Select;

  return (
    <Tooltip title={'Change the active theme'}>
      <SelectContainer>
        <Select
          defaultValue={CABO_LIGHT_THEME}
          style={{
            width: '100%',
          }}
          size={'large'}
          onFocus={lockEditor}
          onBlur={unlockEditor}
          onSelect={unlockEditor}
          onChange={(value: CoreThemes | ExtraThemes) =>
            themeContext.toggleTheme(value)}
        >
          <Option value={CHELEVRA_THEME}>
            <OptionText>Chelevra</OptionText>
          </Option>
          <Option value={CABO_LIGHT_THEME}>
            <OptionText>Cabo Light</OptionText>
          </Option>
        </Select>
      </SelectContainer>
    </Tooltip>
  );
}
