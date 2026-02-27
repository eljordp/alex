import { useState } from 'react'
import { Header } from '../components/layout/Header'

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

      <div className="px-4 py-4 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-vine-500 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => saveName(e.target.value)}
            placeholder="Enter your name for greetings"
            className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-lg focus:outline-none focus:ring-2 focus:ring-vine-300"
          />
        </div>

        {/* Voice Speed */}
        <div>
          <label className="block text-sm font-medium text-vine-500 mb-2">
            Voice Speed: {voiceSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSpeed}
            onChange={e => saveSpeed(parseFloat(e.target.value))}
            className="w-full accent-vine-600"
          />
          <div className="flex justify-between text-xs text-vine-400 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <label className="block text-sm font-medium text-vine-500 mb-2">Notifications</label>
          {notifPermission === 'unsupported' ? (
            <p className="text-vine-400 text-sm">Notifications not supported on this device.</p>
          ) : notifPermission === 'granted' ? (
            <p className="text-green-600 text-sm font-medium">✓ Notifications enabled</p>
          ) : notifPermission === 'denied' ? (
            <p className="text-red-500 text-sm">Notifications blocked. Enable in browser settings.</p>
          ) : (
            <button
              onClick={requestNotifications}
              className="w-full py-3 rounded-xl bg-vine-600 text-white font-medium active:bg-vine-700"
            >
              Enable Notifications
            </button>
          )}
        </div>

        {/* Export */}
        <div>
          <label className="block text-sm font-medium text-vine-500 mb-2">Data</label>
          <button
            onClick={exportTasks}
            className="w-full py-3 rounded-xl bg-vine-100 text-vine-600 font-medium active:bg-vine-200"
          >
            Export Tasks (JSON Backup)
          </button>
        </div>

        {/* About */}
        <div className="pt-4 border-t border-vine-100">
          <p className="text-vine-400 text-sm text-center">
            VinaTask v1.0 — Voice-first task manager
          </p>
          <p className="text-vine-300 text-xs text-center mt-1">
            Built with love for vineyard management 🍇
          </p>
        </div>
      </div>
    </div>
  )
}
