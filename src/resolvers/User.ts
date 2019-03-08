export const User = {
  posts: (parent, args, context, info) => {
    const { posts } = context.db;
    return posts.filter(post => post.author === parent.id);
  },
  comments: (parent, args, context, info) => {
    const { comments } = context.db;
    return comments.filter(comment => comment.author === parent.id);
  }
};
