import React, { useState, useEffect, useCallback } from 'react';
import { Toast, CreateInvitationInput } from './types';
import { useInvitations } from './hooks/useInvitations';
import { useAuth } from './hooks/useAuth';
import { DashboardView } from './views/DashboardView';
import { EditorView } from './views/EditorView';
import { LoginView } from './views/LoginView';
import { ToastContainer } from './components/common/UIComponents';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { user } = useAuth();

  const {
    invitations,
    createInvitation,
    createBlankInvitation,
    duplicateInvitation,
    deleteInvitation,
    updateInvitationStatus,
  } = useInvitations();

  // Listen to browser hash changes (support back/forward buttons)
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash || '#/';
      if (hash === '#/editor/new') {
        const blank = createBlankInvitation();
        window.location.hash = `#/editor/${blank.id}?isNew=true&mode=timeline`;
        return;
      }
      setCurrentHash(hash);
    }
    window.addEventListener('hashchange', handleHashChange);

    // Check initial hash for /editor/new
    if (window.location.hash === '#/editor/new') {
      const blank = createBlankInvitation();
      window.location.hash = `#/editor/${blank.id}?isNew=true&mode=timeline`;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [createBlankInvitation]);

  const showToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const navigateTo = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);

  const handleCreateInvitation = useCallback(
    (input: CreateInvitationInput) => {
      const created = createInvitation(input);
      showToast(`Undangan "${created.title}" berhasil dibuat!`, 'success');
      navigateTo(`#/editor/${created.id}`);
    },
    [createInvitation, navigateTo, showToast]
  );

  const handleCreateBlankInvitation = useCallback(() => {
    const blank = createBlankInvitation();
    showToast('Memulai pembuatan undangan baru...', 'info');
    navigateTo(`#/editor/${blank.id}?isNew=true&mode=timeline`);
  }, [createBlankInvitation, navigateTo, showToast]);

  // ── Route resolution ──────────────────────────────────────────────────────
  const isLoginRoute = currentHash === '#/login' || currentHash === '#/register';
  const editorMatch = currentHash.match(/^#\/editor\/([^/?#]+)/);
  const activeEditorId = editorMatch ? editorMatch[1] : null;
  const isNewInvitation = currentHash.includes('isNew=true');
  const initialTimelineMode = currentHash.includes('mode=timeline') || isNewInvitation;

  const handleNavigateToLogin = useCallback(() => {
    const returnTo = encodeURIComponent(window.location.href);
    const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5175';
    window.location.href = `${authUrl}/#/login?return_to=${returnTo}`;
  }, []);

  useEffect(() => {
    if (isLoginRoute) {
      const mode = currentHash.includes('register') ? 'register' : 'login';
      const returnTo = encodeURIComponent(window.location.origin + '/#/');
      const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5175';
      window.location.href = `${authUrl}/#/${mode}?return_to=${returnTo}`;
    }
  }, [isLoginRoute, currentHash]);

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs font-medium text-on-surface-variant">Mengalihkan ke Portal Autentikasi Nuptia...</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {activeEditorId ? (
        <EditorView
          invitationId={activeEditorId}
          isNew={isNewInvitation}
          initialTimelineMode={initialTimelineMode}
          onBackToDashboard={() => navigateTo('#/')}
          showToast={showToast}
          onNavigateToLogin={handleNavigateToLogin}
        />
      ) : (
        <DashboardView
          invitations={invitations}
          onNavigateToEditor={(id) => navigateTo(`#/editor/${id}`)}
          onCreateInvitation={handleCreateInvitation}
          onCreateBlankInvitation={handleCreateBlankInvitation}
          onDuplicateInvitation={duplicateInvitation}
          onDeleteInvitation={deleteInvitation}
          onChangeStatus={updateInvitationStatus}
          showToast={showToast}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </>
  );
}
