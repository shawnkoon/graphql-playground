// Lib
import { GraphQLServer, PubSub } from 'graphql-yoga';
import path from 'path';

// App
import db from './db';
import { Query, Mutation, Subscription, Comment, Post, User } from './resolvers';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schema.graphql'),
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Comment,
    Post,
    User,
  },
  context: {
    db,
    pubSub,
  },
});

const PORT = 8000;

server.start({ port: PORT }, () => {
  console.log(`\nThe server is up and running at http://localhost:${PORT} ! 🚀\n`);
});
