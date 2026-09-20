import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAdminData } from './hooks/useAdminData';
import { AccessDenied } from './components/common/AccessDenied';
import { LoginView } from './views/LoginView';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardView } from './views/DashboardView';
import { UsersView } from './views/UsersView';
import { InvitationsView } from './views/InvitationsView';
import { TemplatesView } from './views/TemplatesView';
import { PackagesView } from './views/PackagesView';
import { SettingsView } from './views/SettingsView';
import { AdminRoute } from './types';

export default function App() {
  const { user, isAdmin, loading: authLoading, checkAuth, devSetAdmin, logout, login, isAuthenticated } = useAdminAuth();
  const {
    stats,
    users,
    invitations,
    templates,
    packages,
    toast,
    updateUserRole,
    updateUserStatus,
    createInternalUser,
    deleteUser,
    toggleTemplateActive,
    toggleInvitationStatus,
    togglePackage,
  } = useAdminData();

  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs font-medium text-on-surface-variant">Memvalidasi sesi admin...</p>
      </div>
    );
  }

  // Guard 1: Belum terautentikasi → halaman Login
  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={login}
        onDevLogin={devSetAdmin}
      />
    );
  }

  // Guard 2: Sudah login tapi bukan role internal → akses ditolak
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
      {/* Toast feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-inverse-surface text-inverse-on-surface text-xs font-semibold shadow-lg border border-outline-variant/30 flex items-center gap-2 animate-toast">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {route === 'dashboard' && (
        <DashboardView
          stats={stats}
          recentUsers={users}
          recentInvitations={invitations}
          onNavigate={navigateTo}
        />
      )}

      {route === 'users' && (
        <UsersView
          users={users}
          onToggleRole={updateUserRole}
          onToggleStatus={updateUserStatus}
          searchQuery={searchQuery}
        />
      )}

      {route === 'invitations' && (
        <InvitationsView
          invitations={invitations}
          onToggleStatus={toggleInvitationStatus}
          searchQuery={searchQuery}
        />
      )}

      {route === 'templates' && (
        <TemplatesView
          templates={templates}
          onToggleActive={toggleTemplateActive}
          searchQuery={searchQuery}
        />
      )}

      {route === 'packages' && (
        <PackagesView
          packages={packages}
          onTogglePackage={togglePackage}
        />
      )}

      {route === 'settings' && (
        <SettingsView
          currentUser={user}
          users={users}
          onCreateInternalUser={createInternalUser}
          onToggleRole={updateUserRole}
          onToggleStatus={updateUserStatus}
          onDeleteUser={deleteUser}
        />
      )}
    </AdminLayout>
  );
}
