import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { AccessDenied } from './components/common/AccessDenied';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardView } from './views/DashboardView';
import { UsersView } from './views/UsersView';
import { InvitationsView } from './views/InvitationsView';
import { TemplatesView } from './views/TemplatesView';
import { PackagesView } from './views/PackagesView';
import { SettingsView } from './views/SettingsView';
import {
  initialStats,
  initialUsers,
  initialInvitations,
  initialTemplates,
  initialPackages,
} from './data/mockData';
import { AdminRoute, AdminUser, AdminInvitation, AdminTemplate, PackageTier } from './types';

export default function App() {
  const { user, isAdmin, loading, checkAuth, devSetAdmin, logout } = useAdminAuth();
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State management (connected to API via hooks in Task 9)
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [invitations, setInvitations] = useState<AdminInvitation[]>(initialInvitations);
  const [templates, setTemplates] = useState<AdminTemplate[]>(initialTemplates);
  const [packages, setPackages] = useState<PackageTier[]>(initialPackages);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleRole = (userId: string, newRole: 'customer' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleToggleStatus = (userId: string, newStatus: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const handleToggleInvStatus = (invId: string, newStatus: 'Draft' | 'Published' | 'Live') => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invId ? { ...inv, status: newStatus } : inv))
    );
  };

  const handleToggleTemplateActive = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const handleTogglePackage = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs font-medium text-on-surface-variant">Memvalidasi sesi admin...</p>
      </div>
    );
  }

  // Role Guard: user must be authenticated with role === 'admin'
  if (!isAdmin) {
    return (
      <AccessDenied
        userEmail={user?.email}
        userRole={user?.role}
        onRefresh={checkAuth}
        onDevLogin={devSetAdmin}
      />
    );
  }

  // Derive current route
  const path = currentHash.replace(/^#\/?/, '').split('?')[0];
  const route: AdminRoute =
    path === 'users' ? 'users' :
    path === 'invitations' ? 'invitations' :
    path === 'templates' ? 'templates' :
    path === 'packages' ? 'packages' :
    path === 'settings' ? 'settings' : 'dashboard';

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <AdminLayout
      currentRoute={route}
      user={user}
      onLogout={logout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {route === 'dashboard' && (
        <DashboardView
          stats={initialStats}
          recentUsers={users}
          recentInvitations={invitations}
          onNavigate={navigateTo}
        />
      )}

      {route === 'users' && (
        <UsersView
          users={users}
          onToggleRole={handleToggleRole}
          onToggleStatus={handleToggleStatus}
          searchQuery={searchQuery}
        />
      )}

      {route === 'invitations' && (
        <InvitationsView
          invitations={invitations}
          onToggleStatus={handleToggleInvStatus}
          searchQuery={searchQuery}
        />
      )}

      {route === 'templates' && (
        <TemplatesView
          templates={templates}
          onToggleActive={handleToggleTemplateActive}
          searchQuery={searchQuery}
        />
      )}

      {route === 'packages' && (
        <PackagesView
          packages={packages}
          onTogglePackage={handleTogglePackage}
        />
      )}

      {route === 'settings' && <SettingsView />}
    </AdminLayout>
  );
}
