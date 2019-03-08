// Lib
import uuid from 'uuid/v4';

export const Mutation = {
  createUser: (parent, args, context, info) => {
    const { email } = args.data;
    const { users } = context.db;
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
    let { comments, posts, users } = context.db;
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
    const { posts, users } = context.db;
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
    let { comments, posts } = context.db;
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
    const { comments, posts, users } = context.db;
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
    const { comments } = context.db;
    const commentIndex = comments.findIndex(comment => comment.id === id);

    if (commentIndex < 0) {
      throw new Error(`Comment ${id} not found.`);
    }

    const deletedComment = comments.splice(commentIndex, 1)[0];

    return deletedComment;
  }
};
