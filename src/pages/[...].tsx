import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Message } from '../components/Message';

const Component: FunctionComponent<any> = ({ location }) => {
  return (
    <Message error={Error(`404 - "${location.pathname}" ROUTE NOT FOUND`)} />
  );
};

export default Component;

// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query.
export const query = graphql`
  query {
    site {
      siteMetadata {
        env
        domain
        redirectDefaultPrefix
      }
    }
  }
`;
