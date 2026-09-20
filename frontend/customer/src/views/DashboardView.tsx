import React, { useState, useMemo } from 'react';
import { Invitation, Status, CreateInvitationInput } from '../types';
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { InvitationCard } from '../components/dashboard/InvitationCard';
import { CreateInvitationModal } from '../components/dashboard/CreateInvitationModal';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Ic } from '../components/common/Icons';

interface DashboardViewProps {
  invitations: Invitation[];
  onNavigateToEditor: (id: string) => void;
  onCreateInvitation: (input: CreateInvitationInput) => void;
  onCreateBlankInvitation: () => void;
  onDuplicateInvitation: (id: string) => void;
  onDeleteInvitation: (id: string) => void;
  onChangeStatus: (id: string, status: Status) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToLogin?: () => void;
}

export function DashboardView({
  invitations,
  onNavigateToEditor,
  onCreateInvitation,
  onCreateBlankInvitation,
  onDuplicateInvitation,
  onDeleteInvitation,
  onChangeStatus,
  showToast,
  onNavigateToLogin,
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | Status>('Semua');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewingInv, setPreviewingInv] = useState<Invitation | null>(null);

  // Filter logic
  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      const matchStatus = statusFilter === 'Semua' || inv.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        inv.title.toLowerCase().includes(query) ||
        inv.event.groomNick.toLowerCase().includes(query) ||
        inv.event.brideNick.toLowerCase().includes(query) ||
        inv.event.venue.toLowerCase().includes(query) ||
        inv.templateName.toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [invitations, searchQuery, statusFilter]);

  const handleCopyLink = (inv: Invitation) => {
    const url = `${window.location.origin}/#/${inv.slug || inv.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`Link undangan "${inv.title}" berhasil disalin!`, 'success');
  };

  const handleCreate = (input: CreateInvitationInput) => {
    setIsCreateModalOpen(false);
    onCreateInvitation(input);
  };

  const handleDuplicate = (id: string) => {
    onDuplicateInvitation(id);
    showToast('Undangan berhasil diduplikasi!', 'success');
  };

  const handleDelete = (id: string) => {
    onDeleteInvitation(id);
    showToast('Undangan berhasil dihapus', 'info');
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    onChangeStatus(id, newStatus);
    showToast(`Status undangan diubah menjadi ${newStatus}`, newStatus === 'Live' ? 'success' : 'info');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center w-full">
      {/* Top Navbar */}
      <DashboardTopBar onOpenCreateModal={onCreateBlankInvitation} onNavigateToLogin={onNavigateToLogin ?? (() => (window.location.hash = '#/login'))} />

      {/* Main Content Area */}
      <div className="w-full max-w-7xl flex-1 flex flex-col relative shadow-none">
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome & Quick Action Banner */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-primary-container via-surface-container to-secondary-container/40 p-6 sm:p-8 border border-outline-variant/30">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 text-primary text-xs font-bold mb-3 backdrop-blur-xs">
              <Ic.Sparkles s={14} />
              <span>Pusat Kendali Undangan Pernikahan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface font-display leading-tight">
              Selamat datang kembali, Hadiyah ✨
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
              Kelola daftar undangan digitalmu, pantau konfirmasi kehadiran (RSVP) tamu secara real-time, dan edit
              setiap momen spesial dengan mudah.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={onCreateBlankInvitation}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all duration-200"
              >
                <Ic.Plus s={16} />
                <span>Buat Undangan Baru</span>
              </button>
            </div>
          </div>

          {/* Decorative heart watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-primary transform rotate-12">
            <Ic.Heart s={220} />
          </div>
        </section>

        {/* Quick Stats Row */}
        <section>
          <DashboardStats invitations={invitations} />
        </section>

        {/* Filter, Search & Invitation List */}
        <section className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-on-surface font-display">Daftar Undangan Pernikahan</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Menampilkan {filteredInvitations.length} dari {invitations.length} undangan
              </p>
            </div>

            {/* Controls: Search & Status Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <Ic.Search s={16} />
                </span>
                <input
                  type="text"
                  placeholder="Cari mempelai, lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-high text-xs sm:text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary border-0 transition-all placeholder:text-on-surface-variant/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    <Ic.Close s={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-full overflow-x-auto">
                {(['Semua', 'Live', 'Published', 'Draft'] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-surface-container-lowest text-primary font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onEdit={onNavigateToEditor}
                  onPreview={(inv) => setPreviewingInv(inv)}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onChangeStatus={handleStatusChange}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              isSearch={Boolean(searchQuery || statusFilter !== 'Semua')}
              onReset={() => {
                setSearchQuery('');
                setStatusFilter('Semua');
              }}
              onCreateNew={onCreateBlankInvitation}
            />
          )}
        </section>
      </main>
    </div>

      {/* Modal Buat Undangan Baru */}
      <CreateInvitationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      {/* Quick Preview Modal */}
      {previewingInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-sm w-full border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface font-display">{previewingInv.title}</h3>
              <button
                onClick={() => setPreviewingInv(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <Ic.Close s={16} />
              </button>
            </div>
            <div className="aspect-[9/16] max-h-[440px] rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface">
              <img
                src={previewingInv.media.heroUrl}
                alt={previewingInv.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const id = previewingInv.id;
                  setPreviewingInv(null);
                  onNavigateToEditor(id);
                }}
                className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold text-center"
              >
                Buka di Editor Lengkap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
