import React, { useState } from 'react';
import { Invitation, Status, CreateInvitationInput } from '../types';
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar';
import { InvitationCard } from '../components/dashboard/InvitationCard';
import { CreateInvitationModal } from '../components/dashboard/CreateInvitationModal';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Ic } from '../components/common/Icons';
import { useAuth } from '../hooks/useAuth';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewingInv, setPreviewingInv] = useState<Invitation | null>(null);
  const { user } = useAuth();

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
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      {/* Top Navbar */}
      <DashboardTopBar
        onOpenCreateModal={onCreateBlankInvitation}
        onNavigateToLogin={onNavigateToLogin ?? (() => (window.location.hash = '#/login'))}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 flex flex-col">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight font-display">
            Selamat datang kembali, {user?.name ? user.name.split(' ')[0] : 'Hadiyah'} ✨
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2.5 max-w-2xl leading-relaxed">
            Kelola daftar undangan digitalmu, pantau konfirmasi kehadiran (RSVP) tamu secara real-time, dan edit setiap momen spesial dengan mudah.
          </p>
        </section>

        {/* Cards Grid */}
        {invitations.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pb-12">
            {invitations.map((invitation) => (
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
          </section>
        ) : (
          <EmptyState
            isSearch={false}
            onReset={() => {}}
            onCreateNew={onCreateBlankInvitation}
          />
        )}
      </main>

      {/* Modal Buat Undangan Baru */}
      <CreateInvitationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      {/* Quick Preview Modal */}
      {previewingInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full border border-neutral-200 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 font-display">{previewingInv.title}</h3>
              <button
                onClick={() => setPreviewingInv(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 cursor-pointer"
              >
                <Ic.Close s={16} />
              </button>
            </div>
            <div className="aspect-[9/16] max-h-[440px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50">
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
                className="flex-1 py-2.5 rounded-full bg-[#9c177c] hover:bg-[#851369] text-white text-xs font-bold text-center cursor-pointer transition-colors"
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

