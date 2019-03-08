export const Comment = {
  author: (parent, args, context, info) => {
    const { users } = context.db;
    return users.find(user => user.id === parent.author);
  },
  post: (parent, args, context, info) => {
    const { posts } = context.db;
    return posts.find(post => post.id === parent.post);
  }
};
