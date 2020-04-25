import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

const Redirect = ({ to }) => {
  useEffect(() => {
    Router.push(to);
  }, [to]);
  return <div>loading...</div>;
};

Redirect.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Redirect;
