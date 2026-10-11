import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { cn } from '../utils/cn';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{ '--sidebar-width': collapsed ? '72px' : '240px' } as React.CSSProperties}
      className="min-h-screen w-full bg-[#f6f4ff] dark:bg-[#0b1120]"
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <main
        className={cn(
          'min-h-screen min-w-0 pt-16 transition-all duration-300',
          collapsed ? 'ml-[72px]' : 'ml-60'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
