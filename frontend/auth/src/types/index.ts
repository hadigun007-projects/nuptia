export type UserRole = 'customer' | 'admin' | 'developer' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  authProvider: string;
  role: UserRole | string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export interface RedirectState {
  isRedirecting: boolean;
  targetName: string;
  targetRole: string;
  targetUrl: string;
}
