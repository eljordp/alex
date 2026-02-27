import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { parseVoiceInput } from '../../lib/parser'
import { IconMic, IconStop, IconX, IconCheck } from '../ui/Icons'

export function VoiceButton() {
  const navigate = useNavigate()
  const [showOverlay, setShowOverlay] = useState(false)

  const { start, stop, transcript, isListening, isSupported } = useVoiceInput({
    onResult: (text) => {
      setShowOverlay(false)
      const parsed = parseVoiceInput(text)
      const params = new URLSearchParams()
      if (parsed.title) params.set('title', parsed.title)
      if (parsed.category) params.set('category', parsed.category)
      if (parsed.importance) params.set('importance', parsed.importance)
      if (parsed.dueDate) params.set('dueDate', parsed.dueDate)
      if (parsed.dueTime) params.set('dueTime', parsed.dueTime)
      params.set('via', 'voice')
      navigate(`/add?${params.toString()}`)
    },
    onError: () => {
      setShowOverlay(false)
      navigate('/add')
    },
  })

  const handleTap = () => {
    if (!isSupported) {
      navigate('/add')
      return
    }
    if (isListening) {
      stop()
      setShowOverlay(false)
    } else {
      start()
      setShowOverlay(true)
    }
  }

  return (
    <>
      {/* Floating mic button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleTap}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
            isListening
              ? 'bg-red-500 shadow-red-200'
              : 'bg-vine-700 shadow-vine-300/40 hover:bg-vine-800'
          }`}
        >
          {isListening && (
            <span
              className="absolute inset-0 rounded-full bg-red-400"
              style={{ animation: 'pulse-ring 1.5s ease-out infinite' }}
            />
          )}
          <span className="relative z-10">
            {isListening ? <IconStop size={20} /> : <IconMic size={22} />}
          </span>
        </button>
      </div>

      {/* Voice overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              {isListening ? (
                <div className="relative">
                  <IconMic size={28} className="text-red-500" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-vine-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <p className="text-vine-800 font-bold text-lg mb-1">
              {isListening ? 'Listening...' : 'Processing...'}
            </p>
            <p className="text-vine-400 text-sm mb-5">
              {isListening ? 'Speak naturally about your task' : 'Understanding your request'}
            </p>

            {transcript && (
              <div className="bg-vine-50 rounded-xl p-4 mb-5">
                <p className="text-vine-600 text-sm italic leading-relaxed">
                  "{transcript}"
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { stop(); setShowOverlay(false) }}
                className="flex-1 py-3 rounded-xl bg-vine-100 text-vine-600 font-medium flex items-center justify-center gap-2 active:bg-vine-200"
              >
                <IconX size={16} />
                Cancel
              </button>
              {transcript && (
                <button
                  onClick={() => { stop() }}
                  className="flex-1 py-3 rounded-xl bg-vine-700 text-white font-medium flex items-center justify-center gap-2 active:bg-vine-800"
                >
                  <IconCheck size={16} />
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
