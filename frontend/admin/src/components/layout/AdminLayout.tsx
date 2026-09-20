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
    <div className="min-h-screen bg-surface flex flex-col items-center w-full">
      {/* Full-width TopBar */}
      <AdminTopBar
        currentRoute={currentRoute}
        user={user}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Workspace Centered Cluster */}
      <div className="w-full max-w-7xl flex-1 flex flex-row relative shadow-none">
        {/* Sidebar */}
        <AdminSidebar
          currentRoute={currentRoute}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          hideHeader={true}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 w-full animate-fade-in-up min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
