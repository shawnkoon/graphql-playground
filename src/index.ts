import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

// Scalar Types - String, Boolean, Int, Float, ID

// Demo user data
let users = [
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

let posts = [
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

let comments = [
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser: (parent, args, context, info) => {
      const { email } = args.data;
      const emailTaken = users.some(user => user.email === email);
      if (emailTaken) {
        throw new Error(`Email ${email} is already taken.`);
      }

      const user = {
        ...args.data,
        id: uuid()
      };

      users.push(user);

      return user;
    },
    deleteUser: (parent, args, context, info) => {
      const { id } = args;
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex < 0) {
        throw new Error(`User ${id} not found.`);
      }

      const deletedUser = users.splice(userIndex, 1)[0];

      posts = posts.filter(post => {
        const match = post.author === id;

        if (match) {
          // comments on posts by this user.
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });
      // comments on other posts.
      comments = comments.filter(comment => comment.author !== id);

      return deletedUser;
    },
    createPost: (parent, args, context, info) => {
      const { author } = args.data;
      const userExist = users.some(user => user.id === author);

      if (!userExist) {
        throw new Error(`User ${author} not found.`);
      }

      const post = {
        ...args.data,
        id: uuid()
      };

      posts.push(post);

      return post;
    },
    deletePost: (parent, args, context, info) => {
      const { id } = args;
      const postIndex = posts.findIndex(post => post.id === id);
      if (postIndex < 0) {
        throw new Error(`Post ${id} not found.`);
      }

      const deletedPost = posts.splice(postIndex, 1)[0];

      comments = comments.filter(comment => comment.post !== id);

      return deletedPost;
    },
    createComment: (parent, args, context, info) => {
      const { author, post } = args.data;
      const userExist = users.some(user => user.id === author);
      if (!userExist) {
        throw new Error(`User ${author} not found.`);
      }
      const existingPost = posts.find(p => p.id === post);
      if (!existingPost) {
        throw new Error(`Post ${post} not found.`);
      }
      if (!existingPost.published) {
        throw new Error(`Post ${post} is not yet published.`);
      }

      const comment = {
        ...args.data,
        id: uuid()
      };

      comments.push(comment);

      return comment;
    },
    deleteComment: (parent, args, context, info) => {
      const { id } = args;
      const commentIndex = comments.findIndex(comment => comment.id === id);

      if (commentIndex < 0) {
        throw new Error(`Comment ${id} not found.`);
      }

      const deletedComment = comments.splice(commentIndex, 1)[0];

      return deletedComment;
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

const PORT = 8000;

server.start({ port: PORT }, () => {
  console.log(`\nThe server is up and running at http://localhost:${PORT} ! 🚀\n`);
});
