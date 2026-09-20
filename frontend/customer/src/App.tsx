import React, { useState, useEffect, useCallback } from 'react';
import { Toast, CreateInvitationInput } from './types';
import { useInvitations } from './hooks/useInvitations';
import { DashboardView } from './views/DashboardView';
import { EditorView } from './views/EditorView';
import { ToastContainer } from './components/common/UIComponents';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const {
    invitations,
    createInvitation,
    duplicateInvitation,
    deleteInvitation,
    updateInvitationStatus,
  } = useInvitations();

  // Listen to browser hash changes (support back/forward buttons)
  useEffect(() => {
    function handleHashChange() {
      setCurrentHash(window.location.hash || '#/');
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      // Immediately navigate to the editor for the newly created invitation
      navigateTo(`#/editor/${created.id}`);
    },
    [createInvitation, navigateTo, showToast]
  );

  // Parse current route
  const editorMatch = currentHash.match(/^#\/editor\/([^/?#]+)/);
  const activeEditorId = editorMatch ? editorMatch[1] : null;

  return (
    <>
      {activeEditorId ? (
        <EditorView
          invitationId={activeEditorId}
          onBackToDashboard={() => navigateTo('#/')}
          showToast={showToast}
        />
      ) : (
        <DashboardView
          invitations={invitations}
          onNavigateToEditor={(id) => navigateTo(`#/editor/${id}`)}
          onCreateInvitation={handleCreateInvitation}
          onDuplicateInvitation={duplicateInvitation}
          onDeleteInvitation={deleteInvitation}
          onChangeStatus={updateInvitationStatus}
          showToast={showToast}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </>
  );
}
