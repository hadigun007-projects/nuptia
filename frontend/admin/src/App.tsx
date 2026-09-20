import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { AccessDenied } from './components/common/AccessDenied';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardView } from './views/DashboardView';
import { initialStats, initialUsers, initialInvitations } from './data/mockData';
import { AdminRoute } from './types';

export default function App() {
  const { user, isAdmin, loading, checkAuth, devSetAdmin, logout } = useAdminAuth();
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      {route === 'dashboard' ? (
        <DashboardView
          stats={initialStats}
          recentUsers={initialUsers}
          recentInvitations={initialInvitations}
          onNavigate={navigateTo}
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30">
          <h2 className="text-xl font-bold text-on-surface mb-2 capitalize">Menu {route}</h2>
          <p className="text-sm text-on-surface-variant">Konten halaman {route} akan dimuat di sini.</p>
        </div>
      )}
    </AdminLayout>
  );
}
