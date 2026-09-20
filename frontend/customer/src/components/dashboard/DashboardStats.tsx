import React from 'react';
import { Invitation } from '../../types';
import { Ic } from '../common/Icons';

interface DashboardStatsProps {
  invitations: Invitation[];
}

export function DashboardStats({ invitations }: DashboardStatsProps) {
  const total = invitations.length;
  const activeCount = invitations.filter((i) => i.status === 'Live' || i.status === 'Published').length;
  const totalRsvp = invitations.reduce((acc, curr) => acc + (curr.stats?.rsvpAttending || 0), 0);
  const totalGreetings = invitations.reduce((acc, curr) => acc + (curr.stats?.greetingsCount || 0), 0);

  const statsList = [
    {
      label: 'Total Undangan',
      value: total,
      unit: 'Undangan',
      icon: Ic.Layers,
      bgColor: 'bg-primary/10 text-primary',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Undangan Aktif',
      value: activeCount,
      unit: 'Live & Published',
      icon: Ic.Eye,
      bgColor: 'bg-secondary-container text-on-secondary-container',
      borderColor: 'border-secondary/20',
    },
    {
      label: 'Konfirmasi Hadir',
      value: totalRsvp,
      unit: 'Tamu RSVP',
      icon: Ic.Users,
      bgColor: 'bg-tertiary-container text-on-tertiary-container',
      borderColor: 'border-tertiary/20',
    },
    {
      label: 'Ucapan & Doa',
      value: totalGreetings,
      unit: 'Pesan Masuk',
      icon: Ic.MessageHeart,
      bgColor: 'bg-primary-container text-on-primary-container',
      borderColor: 'border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statsList.map((st, idx) => {
        const IconComponent = st.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-[20px] bg-surface-container-lowest border ${st.borderColor} flex flex-col justify-between transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant">{st.label}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.bgColor}`}>
                <IconComponent s={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display tracking-tight leading-none">
                {st.value}
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">{st.unit}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
