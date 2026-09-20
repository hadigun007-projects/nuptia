export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'email' | 'google';
  role: 'customer' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
  invitationCount?: number;
}

export interface MonthlyMetric {
  month: string;
  users: number;
  invitations: number;
  revenue: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalInvitations: number;
  publishedInvitations: number;
  totalTemplates: number;
  totalRevenue: number;
  userGrowthRate: number;
  invitationGrowthRate: number;
  monthlyMetrics: MonthlyMetric[];
}

export interface AdminInvitation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  slug: string;
  title: string;
  templateId: string;
  templateName: string;
  status: 'Draft' | 'Published' | 'Live';
  createdAt: string;
  updatedAt: string;
  views: number;
  rsvpCount: number;
}

export interface AdminTemplate {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  color: string;
  cover: string;
  font: string;
  category: string;
  tier: 'Free' | 'Premium' | 'Exclusive';
  rating: number;
  isPopular: boolean;
  isNew: boolean;
  isActive: boolean;
  usageCount: number;
}

export interface PackageTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  subscribersCount: number;
}

export type AdminRoute =
  | 'dashboard'
  | 'users'
  | 'invitations'
  | 'templates'
  | 'packages'
  | 'settings';
