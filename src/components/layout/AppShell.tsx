import { Outlet, NavLink, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Today', icon: '🏠' },
  { to: '/tasks', label: 'All Tasks', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname === '/add' || location.pathname.startsWith('/task/')

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-vine-200 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-16">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-vine-600 font-semibold'
                      : 'text-vine-400'
                  }`
                }
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
