import { useState, useEffect, useCallback, useRef } from 'react';
import { Invitation, CreateInvitationInput, Status } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'nuptia_auth_token';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { Accept: 'application/json' };
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all invitations belonging to the logged-in customer
  const fetchInvitations = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/invitations`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setInvitations([]);
          return;
        }
        throw new Error(`HTTP Error ${response.status}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setInvitations(result.data);
      } else {
        setInvitations([]);
      }
    } catch (err: any) {
      console.error('[useInvitations] Gagal memuat undangan dari backend:', err);
      setError(err.message || 'Gagal terhubung ke database');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Find invitation in cache
  const getInvitation = useCallback(
    (id: string): Invitation | undefined => {
      return invitations.find((inv) => inv.id === id);
    },
    [invitations]
  );

  // Create new invitation from template / modal
  const createInvitation = useCallback(
    async (input: CreateInvitationInput): Promise<Invitation | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/invitations`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({
            groomNick: input.groomNick,
            brideNick: input.brideNick,
            weddingDate: input.weddingDate,
            templateId: input.templateId,
            templateName: input.templateName,
          }),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          throw new Error(errJson?.error || `Gagal membuat undangan (${response.status})`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          const created: Invitation = result.data;
          setInvitations((prev) => [created, ...prev]);
          return created;
        }
      } catch (err: any) {
        console.error('[useInvitations] Gagal membuat undangan:', err);
        throw err;
      }
    },
    []
  );

  // Create blank invitation from scratch
  const createBlankInvitation = useCallback(
    async (): Promise<Invitation | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/invitations/blank`, {
          method: 'POST',
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          throw new Error(errJson?.error || `Gagal membuat undangan blank (${response.status})`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          const created: Invitation = result.data;
          setInvitations((prev) => [created, ...prev]);
          return created;
        }
      } catch (err: any) {
        console.error('[useInvitations] Gagal membuat undangan blank:', err);
        throw err;
      }
    },
    []
  );

  // Debounce ref for auto-saving
  const updateTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Update invitation (optimistic update immediately, synced to PostgreSQL)
  const updateInvitation = useCallback(
    (id: string, updates: Partial<Invitation>) => {
      // 1. Optimistic local state update
      setInvitations((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          return {
            ...inv,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      // 2. Debounce backend PUT sync (auto-save 500ms)
      if (updateTimeoutRef.current[id]) {
        clearTimeout(updateTimeoutRef.current[id]);
      }

      updateTimeoutRef.current[id] = setTimeout(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/invitations/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            console.error(`[useInvitations] Auto-save error HTTP ${response.status}`);
          }
        } catch (err) {
          console.error('[useInvitations] Gagal menyimpan ke server:', err);
        }
      }, 500);
    },
    []
  );

  // Update status (Draft, Published, Live)
  const updateInvitationStatus = useCallback(
    async (id: string, status: Status) => {
      // Optimistic update
      setInvitations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv))
      );

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/invitations/${id}/status`, {
          method: 'PATCH',
          headers: getAuthHeader(),
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          console.error(`[useInvitations] Update status error HTTP ${response.status}`);
          // Rollback on error
          fetchInvitations();
        }
      } catch (err) {
        console.error('[useInvitations] Gagal update status:', err);
        fetchInvitations();
      }
    },
    [fetchInvitations]
  );

  // Duplicate existing invitation
  const duplicateInvitation = useCallback(
    async (id: string): Promise<Invitation | undefined> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/invitations/${id}/duplicate`, {
          method: 'POST',
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => null);
          throw new Error(errJson?.error || `Gagal menduplikasi undangan (${response.status})`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          const cloned: Invitation = result.data;
          setInvitations((prev) => [cloned, ...prev]);
          return cloned;
        }
      } catch (err: any) {
        console.error('[useInvitations] Gagal menduplikasi undangan:', err);
        throw err;
      }
    },
    []
  );

  // Delete invitation
  const deleteInvitation = useCallback(
    async (id: string) => {
      // Optimistic delete
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/invitations/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          console.error(`[useInvitations] Delete error HTTP ${response.status}`);
          fetchInvitations();
        }
      } catch (err) {
        console.error('[useInvitations] Gagal menghapus undangan:', err);
        fetchInvitations();
      }
    },
    [fetchInvitations]
  );

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
    getInvitation,
    createInvitation,
    createBlankInvitation,
    updateInvitation,
    updateInvitationStatus,
    duplicateInvitation,
    deleteInvitation,
  };
}
