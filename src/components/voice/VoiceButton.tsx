import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { parseVoiceInput } from '../../lib/parser'

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
      // Fallback to manual add
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
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform active:scale-95 ${
            isListening
              ? 'bg-red-500'
              : 'bg-vine-600'
          }`}
        >
          {isListening && (
            <span
              className="absolute inset-0 rounded-full bg-red-400"
              style={{ animation: 'pulse-ring 1.5s ease-out infinite' }}
            />
          )}
          <span className="relative z-10">{isListening ? '⏹' : '🎤'}</span>
        </button>
      </div>

      {/* Voice overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-30 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="mb-4">
              <span className="text-4xl">{isListening ? '🎤' : '⏳'}</span>
            </div>
            <p className="text-vine-700 font-bold text-lg mb-2">
              {isListening ? 'Listening...' : 'Processing...'}
            </p>
            {transcript && (
              <p className="text-vine-500 text-base mb-4 italic">
                "{transcript}"
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { stop(); setShowOverlay(false) }}
                className="flex-1 py-3 rounded-xl bg-vine-100 text-vine-600 font-medium"
              >
                Cancel
              </button>
              {transcript && (
                <button
                  onClick={() => { stop() }}
                  className="flex-1 py-3 rounded-xl bg-vine-600 text-white font-medium"
                >
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
