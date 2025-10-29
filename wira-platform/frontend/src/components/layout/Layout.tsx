import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Layout({
  children,
  className,
  showBreadcrumbs = true,
  title,
  subtitle
}: LayoutProps) {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleSidebarMobileToggle = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col lg:ml-0">
        <Header onMenuClick={handleSidebarMobileToggle} />

        <main className={cn("flex-1 space-y-4 p-4 pt-6", className)}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {showBreadcrumbs && <Breadcrumbs />}
              {title && (
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}