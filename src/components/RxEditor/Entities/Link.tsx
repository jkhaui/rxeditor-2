import React from 'react';

export default ({ contentState, entityKey, children }: any) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a href={url} title={url}>
      {children}
    </a>
  );
}
