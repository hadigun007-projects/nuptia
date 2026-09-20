import React from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Main Studio / Section Card component.
 * Provides unified styling, elevation, responsive padding, and optional header integration.
 */
export function Card({
  children,
  title,
  sub,
  icon,
  headerAction,
  variant = 'elevated',
  padding = 'md',
  footer,
  className = '',
  ...rest
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    elevated: 'bg-surface-container-lowest border border-outline-variant/30',
    outlined: 'bg-transparent border border-outline-variant/60',
    flat: 'bg-surface-container-low border-0',
    filled: 'bg-surface-container-highest/60 border border-outline-variant/20',
  };

  const paddingStyles: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
  };

  const hasHeader = Boolean(title || sub || icon || headerAction);

  return (
    <div
      className={`rounded-[20px] transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...rest}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                {icon}
              </div>
            )}
            <div>
              {typeof title === 'string' ? (
                <h2 className="text-xl font-extrabold text-on-surface font-display tracking-tight">{title}</h2>
              ) : (
                title
              )}
              {sub && (
                <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">{sub}</p>
              )}
            </div>
          </div>
          {headerAction && <div className="flex items-center gap-2 flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {children}

      {footer && (
        <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}

export interface SubCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  selected?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'highlight' | 'muted';
  className?: string;
}

/**
 * Inner item card component for studio lists (e.g. sessions, milestones, bank accounts, songs).
 */
export function SubCard({
  children,
  title,
  subtitle,
  icon,
  badge,
  action,
  selected = false,
  interactive = false,
  variant = 'default',
  className = '',
  onClick,
  ...rest
}: SubCardProps) {
  const variantStyles = {
    default: selected
      ? 'bg-primary-container/25 border-primary ring-2 ring-primary/25'
      : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant/60',
    highlight: selected
      ? 'bg-primary-container/30 border-primary ring-2 ring-primary/30'
      : 'bg-surface-container border-primary/20',
    muted: 'bg-surface-container-lowest/50 border-outline-variant/20',
  };

  const interactiveStyles =
    interactive || onClick ? 'cursor-pointer select-none transition-all active:scale-[0.99]' : '';

  const hasTopRow = Boolean(title || subtitle || icon || badge || action);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-3.5 transition-all duration-200 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...rest}
    >
      {hasTopRow && (
        <div className={`flex items-start justify-between gap-3 ${children ? 'mb-3' : ''}`}>
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {icon && (
              <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {typeof title === 'string' ? (
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">{title}</h4>
                ) : (
                  title
                )}
                {badge}
              </div>
              {subtitle && (
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          {action && <div className="flex items-center gap-1.5 flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
