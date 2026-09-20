import React, { useState } from 'react';
import { AdminRoute, AdminUser } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

interface AdminLayoutProps {
  currentRoute: AdminRoute;
  user: AdminUser | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  user,
  onLogout,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-row w-full">
      {/* Sidebar */}
      <AdminSidebar
        currentRoute={currentRoute}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          currentRoute={currentRoute}
          user={user}
          onLogout={onLogout}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 p-6 md:p-8 w-full animate-fade-in-up">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
