export interface User {
  _id: string;
  email: string;
  password: string; // hashed
  nombre: string;
  rol: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  nombre: string;
  rol?: 'admin' | 'superadmin';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
  token?: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}