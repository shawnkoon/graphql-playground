// Lib
import { PubSub } from 'graphql-yoga';

export const Subscription = {
  comment: {
    subscribe: (parent, args, context, info) => {
      const { postId } = args;
      const pubSub = <PubSub>context.pubSub;
      const { db } = context;

      const post = db.posts.find(post => post.id === postId && post.published);

      if (!post) {
        throw new Error(`Post ${postId} not found.`);
      }

      return pubSub.asyncIterator(`comment: ${postId}`);
    },
  },
  post: {
    subscribe: (parent, args, context, info) => {
      return context.pubSub.asyncIterator('post');
    },
  },
};
