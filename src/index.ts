import { GraphQLServer } from 'graphql-yoga';

// Scalar String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, context, info) {
      console.log('parent', parent);
      console.log('args', args);
      console.log('context', context);
      console.log('info', info);
      if (args.name) {
        return `Hello ${args.name}!`;
      }

      return 'hello';
    },
    me() {
      return {
        id: '12345',
        name: 'Shawnkoon',
        email: 'shawnkoon@example.com'
      };
    },
    post() {
      return {
        id: '23456',
        title: 'This is the title of the Post',
        body: '',
        published: false
      };
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start({ port: 8080 }, () => {
  console.log('\nThe server is up and running at http://localhost:8080 ! 🚀\n');
});
