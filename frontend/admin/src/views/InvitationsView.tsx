import React, { useState, useMemo } from 'react';
import { AdminInvitation } from '../types';

interface InvitationsViewProps {
  invitations: AdminInvitation[];
  onToggleStatus: (invId: string, newStatus: 'Draft' | 'Published' | 'Live') => void;
  searchQuery: string;
}

export const InvitationsView: React.FC<InvitationsViewProps> = ({
  invitations,
  onToggleStatus,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Live' | 'Published' | 'Draft'>('all');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = searchQuery || localSearch;

  const filtered = useMemo(() => {
    return invitations.filter((inv) => {
      const matchesSearch =
        inv.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        inv.slug.toLowerCase().includes(activeSearch.toLowerCase()) ||
        inv.userName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        inv.userEmail.toLowerCase().includes(activeSearch.toLowerCase()) ||
        inv.templateName.toLowerCase().includes(activeSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invitations, activeSearch, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: invitations.length,
      live: invitations.filter((i) => i.status === 'Live').length,
      published: invitations.filter((i) => i.status === 'Published').length,
      draft: invitations.filter((i) => i.status === 'Draft').length,
      totalViews: invitations.reduce((acc, i) => acc + i.views, 0),
    };
  }, [invitations]);

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Status:</span>
          {(['all', 'Live', 'Published', 'Draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {s === 'all' ? 'Semua' : s}
            </button>
          ))}
        </div>

        {!searchQuery && (
          <div className="relative w-full md:w-64">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari judul, slug, atau pembuat..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
      </div>

      {/* Invitations Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40 text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
                <th className="py-3.5 px-5">Undangan & URL Slug</th>
                <th className="py-3.5 px-4">Customer Pemilik</th>
                <th className="py-3.5 px-4">Tema</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Trafik & RSVP</th>
                <th className="py-3.5 px-4">Pembaruan</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <p className="font-semibold text-sm">Tidak ada undangan ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-on-surface">{inv.title}</p>
                      <a
                        href={`http://localhost:5173/#/preview?slug=${inv.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-0.5"
                      >
                        <span>nuptia.id/{inv.slug}</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-on-surface">{inv.userName}</p>
                      <p className="text-[11px] text-on-surface-variant">{inv.userEmail}</p>
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface">
                        🎨 {inv.templateName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${inv.status === 'Live'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Published'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Live'
                              ? 'bg-emerald-500'
                              : inv.status === 'Published'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                        />
                        {inv.status}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span title="Dilihat (Views)" className="flex items-center gap-1 text-on-surface-variant">
                          <svg className="w-3.5 h-3.5 text-on-surface-variant/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-semibold text-on-surface">{inv.views}</span>
                        </span>
                        <span title="Konfirmasi Kehadiran (RSVP)" className="flex items-center gap-1 text-on-surface-variant">
                          <svg className="w-3.5 h-3.5 text-on-surface-variant/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-on-surface">{inv.rsvpCount}</span>
                        </span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                      {new Date(inv.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`http://localhost:5173/#/preview?id=${inv.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded-lg text-[11px] font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors inline-flex items-center gap-1"
                          title="Buka Pratinjau Live"
                        >
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Pratinjau
                        </a>
                        <button
                          onClick={() =>
                            onToggleStatus(
                              inv.id,
                              inv.status === 'Live' ? 'Draft' : 'Live'
                            )
                          }
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${inv.status === 'Live'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                        >
                          {inv.status === 'Live' ? 'Set Draft' : 'Aktifkan Live'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
