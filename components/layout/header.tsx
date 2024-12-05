import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { UserAlarm } from './alarm';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className="grid grid-cols-2 items-center">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="mr-4 lg:!hidden"
          />
          <div className={cn('block lg:!hidden')}>
            <MobileSidebar />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserAlarm />
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
