import { User } from './models/user';
export let users: User[] = [];

export const deleteUser = (id: string) => {
  const deletedUser = users.filter((el) => el.id === id);
  if (deletedUser.length === 0) {
    return null;
  }
  users = users.filter((el) => el.id !== id);
  return deletedUser;
};
