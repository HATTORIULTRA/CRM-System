export interface User {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Roles[];
  phoneNumber: string;
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface IUpdateUserProfile {
  userId: number;
  values: UserRequest;
}

export interface IAddRoleToUser {
  userId: number;
  newRole: Roles;
}

export interface IGetAllUsers {
  searchValue?: string;
  isBlocked?: boolean | string;
  sortBy?: string;
  sortOrder?: string | null | undefined;
}

export enum Roles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export interface IAdminState {
  users: User[];
  userProfile: User | null;
  isLoading: boolean;
}
