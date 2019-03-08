export const Post = {
  author: (parent, args, context, info) => {
    const { users } = context.db;
    return users.find(user => user.id === parent.author);
  },
  comments: (parent, args, context, info) => {
    const { comments } = context.db;
    return comments.filter(comment => comment.post === parent.id);
  }
};
