export interface UserDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string; // 'Admin' | 'Teacher' | 'Student'
}

export interface CreateUserDto {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: string; // 'Admin' | 'Teacher' | 'Student'
}

export interface UpdateUserDto {
  fullName: string;
  email?: string;
  phone?: string;
}

export interface UserCredentialDto {
  id: number;
  username: string;
  role: string;
}
