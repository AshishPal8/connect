export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: Date | undefined;
  bio?: string;
  location?: string;
  avatar?: string;
  isOnboarded: boolean;
  profilePicture: string;
  interests: Interest[];
  socials: Social[];
  createdAt: string;
}

export interface Interest {
  id: number;
  title: string;
  slug: string;
}

export interface Social {
  id: number;
  type: string;
  url: string;
}
