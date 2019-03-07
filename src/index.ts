import { GraphQLServer } from 'graphql-yoga';

// Scalar Types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'Shawnkoon',
    email: 'shawnkoon@example.com',
    age: 42
  },
  {
    id: '2',
    name: 'Curran',
    email: 'curran@example.com',
    age: 24
  },
  {
    id: '3',
    name: 'Kelly',
    email: 'kelly@example.com'
  }
];

const posts = [
  {
    id: '1',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'TypeScript 101',
    body: 'Basic TypeScript class to learn...',
    published: false,
    author: '2'
  }
];

const comments = [
  { id: '101', text: 'Wow, this is an awesome post!', author: '2', post: '1' },
  { id: '102', text: 'Can I get more information about this?', author: '1', post: '3' },
  { id: '103', text: 'I like the idea', author: '3', post: '2' },
  { id: '104', text: 'Hire me', author: '1', post: '1' }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    comments: (parent, args, context, info) => {
      return comments;
    },
    users: (parent, args, context, info) => {
      const { query } = args;
      if (!query) {
        return users;
      }
      return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    },
    posts: (parent, args, context, info) => {
      const { query } = args;
      if (!query) {
        return posts;
      }
      return posts.filter(
        post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
    me: () => {
      return users[0];
    },
    post: () => {
      return posts[0];
    }
  },
  Comment: {
    author: (parent, args, context, info) => {
      return users.find(user => user.id === parent.author);
    },
    post: (parent, args, context, info) => {
      return posts.find(post => post.id === parent.post);
    }
  },
  Post: {
    author: (parent, args, context, info) => {
      return users.find(user => user.id === parent.author);
    },
    comments: (parent, args, context, info) => {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts: (parent, args, context, info) => {
      return posts.filter(post => post.author === parent.id);
    },
    comments: (parent, args, context, info) => {
      return comments.filter(comment => comment.author === parent.id);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start({ port: 8080 }, () => {
  console.log('\nThe server is up and running at http://localhost:8080 ! 🚀\n');
});
