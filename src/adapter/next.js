import Router from 'next/router';

export const Link = ({ to, children, ...props }) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};

export const navigate = (...args) => Router.push(...args);
