import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { IconUser, IconVolume, IconBell, IconDownload, IconCheck, IconGrape } from '../components/ui/Icons'

export function SettingsScreen() {
  const [name, setName] = useState(() => localStorage.getItem('vinatask-name') || '')
  const [voiceSpeed, setVoiceSpeed] = useState(() => {
    return parseFloat(localStorage.getItem('vinatask-voice-speed') || '1')
  })
  const [notifPermission, setNotifPermission] = useState<string>(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  })

  const saveName = (val: string) => {
    setName(val)
    localStorage.setItem('vinatask-name', val)
  }

  const saveSpeed = (val: number) => {
    setVoiceSpeed(val)
    localStorage.setItem('vinatask-voice-speed', String(val))
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  const exportTasks = async () => {
    const { getAllTasks } = await import('../db/database')
    const tasks = await getAllTasks()
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vinatask-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-full">
      <Header title="Settings" />

      <div className="px-5 py-5 space-y-6">
        {/* Name */}
        <SettingsSection icon={<IconUser size={18} />} label="Your Name">
          <input
            type="text"
            value={name}
            onChange={e => saveName(e.target.value)}
            placeholder="Enter your name for greetings"
            className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300 placeholder:text-vine-300"
          />
        </SettingsSection>

        {/* Voice Speed */}
        <SettingsSection icon={<IconVolume size={18} />} label={`Voice Speed: ${voiceSpeed.toFixed(1)}x`}>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSpeed}
            onChange={e => saveSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-vine-400 mt-1.5 font-medium uppercase tracking-wide">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={<IconBell size={18} />} label="Notifications">
          {notifPermission === 'unsupported' ? (
            <p className="text-vine-400 text-sm">Not supported on this device.</p>
          ) : notifPermission === 'granted' ? (
            <div className="flex items-center gap-2 py-3 px-4 bg-green-50 rounded-xl">
              <IconCheck size={16} className="text-green-600" />
              <span className="text-green-700 text-sm font-medium">Notifications enabled</span>
            </div>
          ) : notifPermission === 'denied' ? (
            <p className="text-red-500 text-sm py-3 px-4 bg-red-50 rounded-xl">
              Blocked. Enable in your browser settings.
            </p>
          ) : (
            <button
              onClick={requestNotifications}
              className="w-full py-3 rounded-xl bg-vine-700 text-white font-medium active:bg-vine-800 transition-colors"
            >
              Enable Notifications
            </button>
          )}
        </SettingsSection>

        {/* Export */}
        <SettingsSection icon={<IconDownload size={18} />} label="Data">
          <button
            onClick={exportTasks}
            className="w-full py-3 rounded-xl bg-white border border-vine-200 text-vine-600 font-medium flex items-center justify-center gap-2 active:bg-vine-50 hover:border-vine-300"
          >
            <IconDownload size={16} />
            Export Tasks (JSON)
          </button>
        </SettingsSection>

        {/* About */}
        <div className="pt-6 border-t border-vine-100 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vine-100 flex items-center justify-center">
            <IconGrape size={18} className="text-vine-500" />
          </div>
          <div className="text-center">
            <p className="text-vine-500 text-sm font-medium">VinaTask v1.0</p>
            <p className="text-vine-300 text-xs mt-0.5">
              Voice-first task manager for vineyard management
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ icon, label, children }: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-vine-400">{icon}</span>
        <label className="text-xs font-semibold text-vine-500 uppercase tracking-wide">{label}</label>
      </div>
      {children}
    </div>
  )
}
