export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  isOnboarded: boolean;
  profilePicture: string;
  createdAt: string;
}
