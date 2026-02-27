import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { IconHome, IconList, IconSettings } from '../ui/Icons'

const tabs = [
  { to: '/', label: 'Today', Icon: IconHome },
  { to: '/tasks', label: 'All Tasks', Icon: IconList },
  { to: '/settings', label: 'Settings', Icon: IconSettings },
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-vine-200/60 pb-[env(safe-area-inset-bottom)] z-30">
          <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'text-vine-700'
                      : 'text-vine-400 hover:text-vine-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <tab.Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
