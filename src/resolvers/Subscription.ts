// Lib
import { PubSub } from 'graphql-yoga';

export const Subscription = {
  count: {
    subscribe(parent, args, context, info) {
      const pubSub = <PubSub>context.pubSub;
      let count = 0;

      setInterval(() => {
        count++;
        pubSub.publish('count', { count });
      }, 1000);

      return pubSub.asyncIterator('count');
    },
  },
};
