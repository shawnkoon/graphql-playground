export const Query = {
  comments: (parent, args, context, info) => {
    const { comments } = context.db;
    return comments;
  },
  users: (parent, args, context, info) => {
    const { query } = args;
    const { users } = context.db;
    if (!query) {
      return users;
    }
    return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
  },
  posts: (parent, args, context, info) => {
    const { query } = args;
    const { posts } = context.db;
    if (!query) {
      return posts;
    }
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    );
  },
  me: (parent, args, context, info) => {
    const { users } = context.db;
    return users[0];
  },
  post: (parent, args, context, info) => {
    const { posts } = context.db;
    return posts[0];
  },
};
