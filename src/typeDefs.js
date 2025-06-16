import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Query {
    // your existing queries
  }

  type Mutation {
    uploadFile(file: Upload!): File!
    // other mutations
  }

  // other type definitions
`;

export default typeDefs;
