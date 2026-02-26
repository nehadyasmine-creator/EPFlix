export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  points: number;
  password?: string;
}