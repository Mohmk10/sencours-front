export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ETUDIANT' | 'INSTRUCTEUR' | 'ADMIN' | 'SUPER_ADMIN';
  bio?: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  isActive?: boolean;
}
