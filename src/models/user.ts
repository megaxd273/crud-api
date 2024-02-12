export interface User extends UserBody {
  id: string;
}
export interface UserBody {
  username: string;
  age: number;
  hobbies: string[];
}
