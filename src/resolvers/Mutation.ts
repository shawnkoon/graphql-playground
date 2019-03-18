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
      id: uuid(),
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
  updateUser: (parent, args, context, info) => {
    const { users } = context.db;
    const { id, data } = args;

    const oldUser = users.find(user => user.id === id);

    if (!oldUser) {
      throw new Error(`User ${id} not found.`);
    }

    if (typeof data.email === 'string') {
      const emailTaken = users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error(`Email ${data.email} already in use.`);
      }

      oldUser.email = data.email;
    }

    if (typeof data.name === 'string') {
      oldUser.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      oldUser.age = data.age;
    }

    return oldUser;
  },
  createPost: (parent, args, context, info) => {
    const { author } = args.data;
    const { db, pubSub } = context;
    const { posts, users } = db;
    const userExist = users.some(user => user.id === author);

    if (!userExist) {
      throw new Error(`User ${author} not found.`);
    }

    const post = {
      ...args.data,
      id: uuid(),
    };

    posts.push(post);

    if (post.published) {
      pubSub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost: (parent, args, context, info) => {
    const { id } = args;
    const { db, pubSub } = context;
    let { comments, posts } = db;
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex < 0) {
      throw new Error(`Post ${id} not found.`);
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    comments = comments.filter(comment => comment.post !== id);

    if (deletedPost.pubished) {
      pubSub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },
  updatePost: (parent, args, context, info) => {
    const { id, data } = args;
    const { db, pubSub } = context;
    const { posts } = db;

    const post = posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error(`Post ${id} not found.`);
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published !== 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted.
        pubSub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        // created.
        pubSub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
    } else if (post.publihsed) {
      // updated.
      pubSub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },
  createComment: (parent, args, context, info) => {
    const { author, post } = args.data;
    const { db, pubSub } = context;
    const { comments, posts, users } = db;

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
      id: uuid(),
    };

    comments.push(comment);
    pubSub.publish(`comment: ${post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });

    return comment;
  },
  deleteComment: (parent, args, context, info) => {
    const { id } = args;
    const { db, pubSub } = context;
    const { comments } = db;
    const commentIndex = comments.findIndex(comment => comment.id === id);

    if (commentIndex < 0) {
      throw new Error(`Comment ${id} not found.`);
    }

    const [deletedComment] = comments.splice(commentIndex, 1);

    pubSub.publish(`comment: ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  updateComment: (parent, args, context, info) => {
    const { id, data } = args;
    const { db, pubSub } = context;
    const { comments } = db;

    const comment = comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error(`Comment ${id} not found.`);
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubSub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });

    return comment;
  },
};
