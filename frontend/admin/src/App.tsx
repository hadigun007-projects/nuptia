import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { AccessDenied } from './components/common/AccessDenied';
import { AdminRoute } from './types';

export default function App() {
  const { user, isAdmin, loading, checkAuth, devSetAdmin, logout } = useAdminAuth();
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');

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

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Task 2 Shell: will be wrapped with AdminLayout in Task 3 */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Nuptia Admin Console</h1>
            <p className="text-sm text-on-surface-variant">
              Rute aktif: <span className="font-semibold text-primary">{route}</span> | Masuk sebagai: <strong className="text-on-surface">{user?.email}</strong>
            </p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20 transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
