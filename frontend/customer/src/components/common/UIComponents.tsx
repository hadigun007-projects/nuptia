import React, { useState } from 'react';
import { Status, Toast } from '../../types';
import { Ic } from './Icons';

/* ── Formatters ────────────────────────────────────────────────────── */
export function formatDate(d: string) {
  if (!d) return '—';
  try {
    const dt = new Date(d.includes('T') ? d : d + 'T00:00:00');
    return dt.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

export function formatShortDate(d: string) {
  if (!d) return '—';
  try {
    const dt = new Date(d.includes('T') ? d : d + 'T00:00:00');
    return dt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

export function formatTime(t: string) {
  if (!t) return '—';
  const parts = t.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}.${parts[1]} WIB`;
  }
  return t;
}

/* ── Status Badge Styles ───────────────────────────────────────────── */
export const STATUS_STYLES: Record<Status, { badge: string; dot?: string; label: string }> = {
  Draft: {
    badge: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/60',
    label: 'Draft',
  },
  Published: {
    badge: 'bg-secondary-container text-on-secondary-container border border-secondary/20',
    label: 'Published',
  },
  Live: {
    badge: 'bg-primary-container text-on-primary-container border border-primary/30 shadow-xs',
    dot: 'bg-primary animate-pulse-dot',
    label: 'Live',
  },
};

/* ── M3 Text Field ─────────────────────────────────────────────────── */
export function M3Field({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  rows = 3,
  placeholder = '',
  className = '',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0 || type === 'date' || type === 'time';
  const base =
    'w-full bg-surface-container-high rounded-2xl border-0 outline-none text-sm text-on-surface transition-all duration-200';
  const ring = focused ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant';
  const labelCls = `absolute left-4 transition-all duration-200 pointer-events-none z-10 font-medium ${
    active ? 'top-2 text-[11px] text-primary' : 'top-1/2 -translate-y-1/2 text-sm text-on-surface-variant'
  }`;

  return (
    <div className={`relative ${className}`}>
      <label className={labelCls}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          placeholder={focused ? placeholder : ''}
          className={`${base} ${ring} pt-6 pb-3 px-4 resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          className={`${base} ${ring} pt-6 pb-3 px-4 h-14`}
        />
      )}
    </div>
  );
}

/* ── M3 Switch ─────────────────────────────────────────────────────── */
export function M3Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
      type="button"
      className={`relative flex items-center w-14 h-8 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-outline'
      }`}
    >
      <span
        className={`absolute w-6 h-6 rounded-full shadow-md transition-all duration-300 ${
          checked ? 'left-7 bg-on-primary' : 'left-1 bg-surface-container-highest'
        }`}
      />
    </button>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`shimmer-bg rounded-xl ${className}`} />
);

/* ── Card ────────────────────────────────────────────────────────── */
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────────────── */
export function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-extrabold text-on-surface font-display">{title}</h2>
      {sub && <p className="text-sm text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Toast Container ─────────────────────────────────────────────── */
export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  const colors: Record<string, string> = {
    success: 'bg-inverse-surface text-inverse-on-surface',
    error: 'bg-error text-on-error',
    info: 'bg-inverse-surface text-inverse-on-surface',
  };
  const icons: Record<string, React.ReactNode> = {
    success: <Ic.Check s={16} />,
    error: <Ic.Close s={16} />,
    info: <Ic.Cloud s={16} />,
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-toast pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl text-sm font-medium ${colors[t.type]}`}
        >
          <span className="opacity-80">{icons[t.type]}</span>
          <span>{t.msg}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            title="Tutup"
          >
            <Ic.Close s={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
