export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isEmailVerified: boolean;
  role: 'customer' | 'admin';
}

export interface UpdateUserDto {
  role: 'customer' | 'admin';
}
