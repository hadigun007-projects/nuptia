import React from 'react';
import { AdminStats, AdminUser, AdminInvitation } from '../types';

interface DashboardViewProps {
  stats: AdminStats;
  recentUsers: AdminUser[];
  recentInvitations: AdminInvitation[];
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentUsers,
  recentInvitations,
  onNavigate,
}) => {
  // SVG Chart calculation for monthly metrics
  const maxMetricVal = Math.max(
    ...stats.monthlyMetrics.map((m) => Math.max(m.users, m.invitations)),
    10
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Total Pengguna</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/60 text-primary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-on-surface">{stats.totalUsers.toLocaleString('id-ID')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-600 font-bold">+{stats.userGrowthRate}%</span>
              <span className="text-on-surface-variant">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Invitations */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Undangan Dibuat</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/70 text-secondary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-on-surface">{stats.totalInvitations.toLocaleString('id-ID')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-600 font-bold">+{stats.invitationGrowthRate}%</span>
              <span className="text-on-surface-variant">publikasi baru</span>
            </div>
          </div>
        </div>

        {/* Card 3: Live Invitations */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Undangan Terpublikasi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-on-surface">{stats.publishedInvitations.toLocaleString('id-ID')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-on-surface-variant">
              <span className="font-semibold text-on-surface">
                {Math.round((stats.publishedInvitations / (stats.totalInvitations || 1)) * 100)}%
              </span>
              <span>tingkat publikasi live</span>
            </div>
          </div>
        </div>

        {/* Card 4: Template Catalog */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Katalog Desain</span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-container/70 text-tertiary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-on-surface">{stats.totalTemplates} Tema</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-on-surface-variant">
              <span className="text-primary font-semibold">100% Aktif</span>
              <span>siap dipakai customer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart (Pure SVG) */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-on-surface">Tren Pertumbuhan Bulanan</h3>
            <p className="text-xs text-on-surface-variant">Perbandingan pendaftaran pengguna dan pembuatan undangan</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-on-surface-variant">Pengguna Baru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-secondary" />
              <span className="text-on-surface-variant">Undangan Dibuat</span>
            </div>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="w-full h-52 flex items-end justify-between gap-3 pt-4 px-2">
          {stats.monthlyMetrics.map((item, idx) => {
            const userHeight = (item.users / maxMetricVal) * 140;
            const invHeight = (item.invitations / maxMetricVal) * 140;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* User Bar */}
                  <div
                    style={{ height: `${Math.max(userHeight, 4)}px` }}
                    className="w-1/3 max-w-[20px] bg-primary rounded-t-md transition-all duration-300 group-hover:opacity-80 relative"
                    title={`Pengguna: ${item.users}`}
                  />
                  {/* Invitation Bar */}
                  <div
                    style={{ height: `${Math.max(invHeight, 4)}px` }}
                    className="w-1/3 max-w-[20px] bg-secondary rounded-t-md transition-all duration-300 group-hover:opacity-80 relative"
                    title={`Undangan: ${item.invitations}`}
                  />
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Users & Recent Invitations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Table Card */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">Pengguna Baru</h3>
              <p className="text-xs text-on-surface-variant">Akun yang baru saja mendaftar</p>
            </div>
            <button
              onClick={() => onNavigate('#/users')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'admin'
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container text-on-surface-variant'
                      }`}
                  >
                    {user.role}
                  </span>
                  <span className="text-[10px] text-on-surface-variant hidden sm:inline">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invitations Table Card */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">Undangan Terkini</h3>
              <p className="text-xs text-on-surface-variant">Proyek undangan customer yang sedang berjalan</p>
            </div>
            <button
              onClick={() => onNavigate('#/invitations')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {recentInvitations.slice(0, 5).map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{inv.title}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    Oleh <span className="font-medium text-on-surface">{inv.userName}</span> • Tema {inv.templateName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'Published' || inv.status === 'Live'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    {inv.status}
                  </span>
                  <a
                    href={`http://localhost:5173/#/preview?id=${inv.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors"
                    title="Pratinjau Undangan"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
