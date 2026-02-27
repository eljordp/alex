import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { IconHome, IconList, IconSettings, IconPlus } from '../ui/Icons'

const tabs = [
  { to: '/', label: 'Today', Icon: IconHome },
  { to: '/tasks', label: 'All Tasks', Icon: IconList },
  { to: '/settings', label: 'Settings', Icon: IconSettings },
]

export function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname === '/add' || location.pathname.startsWith('/task/')

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-lg mx-auto relative">
            {/* Floating add button */}
            <NavLink
              to="/add"
              className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-vine-700 rounded-full flex items-center justify-center shadow-lg shadow-vine-700/30 active:scale-95 transition-transform z-10"
            >
              <IconPlus size={24} className="text-white" strokeWidth={2.5} />
            </NavLink>

            <div className="bg-white border-t border-vine-200/50 pb-[env(safe-area-inset-bottom)]">
              <div className="flex justify-around items-center h-16 px-4">
                {tabs.map((tab, i) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 py-2 transition-all ${
                        i === 1 ? 'px-10' : 'px-6'
                      } ${
                        isActive
                          ? 'text-vine-700'
                          : 'text-vine-300'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <tab.Icon size={24} strokeWidth={isActive ? 2.2 : 1.5} />
                        <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                          {tab.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
