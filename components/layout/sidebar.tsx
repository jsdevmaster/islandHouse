'use client';

import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { userNavItems } from '@/constants/data';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Image src="/logo.png" width={150} height={150} alt="logo-web" />
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav
              items={userInfo.role === 'admin' ? navItems : userNavItems}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
