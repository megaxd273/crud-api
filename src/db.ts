import { User } from './models/user';
import { v4 as uuidv4 } from 'uuid';
export let users: User[] = [
  {
    id: uuidv4(),
    username: 'stas',
    age: 22,
    hobbies: ['gaming', 'wasting time', 'eating', 'smoking'],
  },
];

export const deleteUser = (id: string) => {
  const deletedUser = users.filter((el) => el.id === id);
  if (deletedUser.length === 0) {
    return null;
  }
  users = users.filter((el) => el.id !== id);
  return deletedUser;
};
