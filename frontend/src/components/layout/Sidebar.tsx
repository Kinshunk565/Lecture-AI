import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Library, Search, Clock, BarChart3, Settings, Bookmark } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lectures', icon: Library, label: 'Lectures' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  if (isLanding) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-40">
        <div className="h-16 px-5 flex items-center gap-2.5 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[var(--color-primary)]">LectureAI</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <span className="section-title px-3 mb-2">Navigation</span>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all no-underline ${
                  isActive
                    ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                    : 'text-[var(--color-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-secondary)]">LectureAI v1.0</p>
          <p className="text-xs text-[var(--color-secondary)] opacity-60">AI-powered lecture intelligence</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-2 py-1.5 flex justify-around">
        {navItems.slice(0, 5).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-xs no-underline transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
