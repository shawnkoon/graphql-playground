const users = [
  {
    id: '1',
    name: 'Shawnkoon',
    email: 'shawnkoon@example.com',
    age: 42,
  },
  {
    id: '2',
    name: 'Curran',
    email: 'curran@example.com',
    age: 24,
  },
  {
    id: '3',
    name: 'Kelly',
    email: 'kelly@example.com',
  },
];

const posts = [
  {
    id: '1',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: false,
    author: '1',
  },
  {
    id: '2',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: true,
    author: '1',
  },
  {
    id: '3',
    title: 'TypeScript 101',
    body: 'Basic TypeScript class to learn...',
    published: false,
    author: '2',
  },
];

const comments = [
  { id: '101', text: 'Wow, this is an awesome post!', author: '2', post: '1' },
  { id: '102', text: 'Can I get more information about this?', author: '1', post: '3' },
  { id: '103', text: 'I like the idea', author: '3', post: '2' },
  { id: '104', text: 'Hire me', author: '1', post: '1' },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
