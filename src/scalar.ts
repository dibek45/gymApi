import { GraphQLScalarType, Kind } from 'graphql';

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new Error('Upload scalar can only parse string values');
    }
    return ast.value;
  },
  serialize(value) {
    return value;
  },
});
