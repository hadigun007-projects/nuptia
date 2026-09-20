import { useState, useEffect, useCallback } from 'react';
import {
  AdminStats,
  AdminUser,
  AdminInvitation,
  AdminTemplate,
  PackageTier,
  UserRole,
  CreateInternalUserPayload,
} from '../types';
import {
  initialStats,
  initialUsers,
  initialInvitations,
  initialTemplates,
  initialPackages,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'nuptia_auth_token';

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [invitations, setInvitations] = useState<AdminInvitation[]>(initialInvitations);
  const [templates, setTemplates] = useState<AdminTemplate[]>(initialTemplates);
  const [packages, setPackages] = useState<PackageTier[]>(initialPackages);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch initial data from backend API
  const refreshData = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token === 'dev-admin-token') {
      return; // Use local data in dev bypass mode
    }

    setLoading(true);
    try {
      // 1. Fetch Stats
      const resStats = await fetch(`${API_BASE_URL}/api/v1/admin/stats`, {
        headers: { ...getAuthHeader(), Accept: 'application/json' },
      });
      if (resStats.ok) {
        const json = await resStats.json();
        if (json.success && json.data) {
          setStats((prev) => ({ ...prev, ...json.data }));
        }
      }

      // 2. Fetch Users
      const resUsers = await fetch(`${API_BASE_URL}/api/v1/admin/users?limit=100`, {
        headers: { ...getAuthHeader(), Accept: 'application/json' },
      });
      if (resUsers.ok) {
        const json = await resUsers.json();
        if (json.success && json.data?.users) {
          setUsers(json.data.users);
        }
      }

      // 3. Fetch Templates
      const resTemplates = await fetch(`${API_BASE_URL}/api/v1/admin/templates`, {
        headers: { ...getAuthHeader(), Accept: 'application/json' },
      });
      if (resTemplates.ok) {
        const json = await resTemplates.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: AdminTemplate[] = json.data.map((t: any) => ({
            id: t.id,
            slug: t.slug,
            name: t.name,
            tagline: t.tagline || '',
            color: '#A3158A',
            cover: t.thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
            font: 'sans',
            category: t.category || 'General',
            tier: t.tier === 'premium' ? 'Premium' : 'Free',
            rating: t.rating || 5.0,
            isPopular: Boolean(t.isPopular),
            isNew: Boolean(t.isNew),
            isActive: Boolean(t.isActive),
            usageCount: 120,
          }));
          setTemplates(mapped);
        }
      }
    } catch {
      // Retain fallback data gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Mutations
  const updateUserRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== 'dev-admin-token') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/role`, {
            method: 'PATCH',
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error || 'Gagal mengubah role');
          }
        } catch (err: any) {
          showToast(`Gagal sinkron ke server: ${err.message}`);
          return;
        }
      }
      showToast(`Role pengguna berhasil diubah menjadi ${newRole}`);
    },
    [showToast]
  );

  const createInternalUser = useCallback(
    async (payload: CreateInternalUserPayload) => {
      const tempId = `usr-${Date.now()}`;
      const newUser: AdminUser = {
        id: tempId,
        name: payload.name,
        email: payload.email,
        authProvider: 'email',
        role: payload.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        invitationCount: 0,
      };

      // Optimistic update
      setUsers((prev) => [newUser, ...prev]);

      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== 'dev-admin-token') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/internal-users`, {
            method: 'POST',
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            setUsers((prev) => prev.filter((u) => u.id !== tempId));
            throw new Error(json.error || 'Gagal menambahkan user internal');
          }
          if (json.data?.id) {
            setUsers((prev) =>
              prev.map((u) => (u.id === tempId ? { ...u, id: json.data.id } : u))
            );
          }
        } catch (err: any) {
          showToast(`Gagal membuat user: ${err.message}`);
          throw err;
        }
      }
      showToast(`User internal ${payload.name} (${payload.role}) berhasil ditambahkan`);
      return newUser;
    },
    [showToast]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      const targetUser = users.find((u) => u.id === userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== 'dev-admin-token') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            if (targetUser) {
              setUsers((prev) => [targetUser, ...prev]);
            }
            throw new Error(json.error || 'Gagal menghapus user');
          }
        } catch (err: any) {
          showToast(`Gagal menghapus user: ${err.message}`);
          throw err;
        }
      }
      showToast('Pengguna berhasil dihapus');
    },
    [users, showToast]
  );

  const updateUserStatus = useCallback(
    async (userId: string, newStatus: 'active' | 'suspended') => {
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );

      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== 'dev-admin-token') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error || 'Gagal mengubah status');
          }
        } catch (err: any) {
          showToast(`Gagal sinkron ke server: ${err.message}`);
          return;
        }
      }
      showToast(
        newStatus === 'active'
          ? 'Akun pengguna berhasil diaktifkan'
          : 'Akun pengguna ditangguhkan (suspended)'
      );
    },
    [showToast]
  );

  const toggleTemplateActive = useCallback(
    async (templateId: string) => {
      let targetNewState = true;
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.id === templateId) {
            targetNewState = !t.isActive;
            return { ...t, isActive: !t.isActive };
          }
          return t;
        })
      );

      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== 'dev-admin-token') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/templates/${templateId}/active`, {
            method: 'PATCH',
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error || 'Gagal mengubah status template');
          }
        } catch (err: any) {
          showToast(`Gagal sinkron ke server: ${err.message}`);
          return;
        }
      }
      showToast(
        targetNewState
          ? 'Tema diaktifkan untuk customer'
          : 'Tema dinonaktifkan dari katalog customer'
      );
    },
    [showToast]
  );

  const toggleInvitationStatus = useCallback(
    (invId: string, newStatus: 'Draft' | 'Published' | 'Live') => {
      setInvitations((prev) =>
        prev.map((inv) => (inv.id === invId ? { ...inv, status: newStatus } : inv))
      );
      showToast(`Status undangan berhasil diubah menjadi ${newStatus}`);
    },
    [showToast]
  );

  const togglePackage = useCallback(
    (pkgId: string) => {
      setPackages((prev) =>
        prev.map((p) => (p.id === pkgId ? { ...p, isActive: !p.isActive } : p))
      );
      showToast('Status ketersediaan paket berhasil diperbarui');
    },
    [showToast]
  );

  return {
    stats,
    users,
    invitations,
    templates,
    packages,
    loading,
    toast,
    refreshData,
    updateUserRole,
    updateUserStatus,
    createInternalUser,
    deleteUser,
    toggleTemplateActive,
    toggleInvitationStatus,
    togglePackage,
  };
}
