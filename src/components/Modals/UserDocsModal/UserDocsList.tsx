import React from 'react';
import { List } from 'antd';

const { Item } = List;

const mockSavedData = [
  'A Review of Family Law in Australia',
  'Untitled Document 30/10/19',
];

export default ({handleCancel}: any) =>
  <List
    bordered
    size={'large'}
    style={{
      cursor: 'pointer',
    }}
    dataSource={mockSavedData}
    renderItem={item => <Item onClick={() => handleCancel()}>{item}</Item>}
  />;
