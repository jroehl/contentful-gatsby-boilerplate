import React, { FunctionComponent } from 'react';

export const Message: FunctionComponent<{ error?: Error }> = ({ error }) => {
  return (
    <p style={{ color: '#FF0000', whiteSpace: 'pre' }}>
      <code>{error?.message || JSON.stringify(error, null, 2)}</code>
    </p>
  );
};
