import React from 'react';

export const Error = ({ error }) => {
  return (
    <p style={{ color: '#FF0000', whiteSpace: 'pre' }}>
      <code>{error?.message || JSON.stringify(error, null, 2)}</code>
    </p>
  );
};
