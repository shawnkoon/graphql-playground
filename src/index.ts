// Lib
import { GraphQLServer } from 'graphql-yoga';
import path from 'path';

// App
import db from './db';
import { Query, Mutation, Comment, Post, User } from './resolvers';

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schema.graphql'),
  resolvers: {
    Query,
    Mutation,
    Comment,
    Post,
    User
  },
  context: {
    db
  }
});

const PORT = 8000;

server.start({ port: PORT }, () => {
  console.log(`\nThe server is up and running at http://localhost:${PORT} ! 🚀\n`);
});
