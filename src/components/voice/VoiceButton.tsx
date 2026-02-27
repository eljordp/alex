import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { parseVoiceInput } from '../../lib/parser'
import { IconMic, IconStop, IconX, IconCheck } from '../ui/Icons'

interface VoiceButtonProps {
  inline?: boolean
}

export function VoiceButton({ inline }: VoiceButtonProps) {
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
      if (!inline) navigate('/add')
    },
  })

  const handleTap = () => {
    if (!isSupported) {
      if (!inline) navigate('/add')
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

  // Inline mode: just a button within the page
  if (inline) {
    return (
      <>
        <button
          onClick={handleTap}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all ${
            isListening
              ? 'bg-red-500 text-white active:bg-red-600'
              : 'bg-vine-700 text-white active:bg-vine-800'
          }`}
        >
          {isListening ? <IconStop size={18} /> : <IconMic size={18} />}
          {isListening ? 'Tap to stop' : 'Start speaking'}
        </button>

        {showOverlay && <VoiceOverlay isListening={isListening} transcript={transcript} stop={stop} setShowOverlay={setShowOverlay} />}
      </>
    )
  }

  // Default: no floating button anymore (we use + in nav)
  return null
}

function VoiceOverlay({ isListening, transcript, stop, setShowOverlay }: {
  isListening: boolean
  transcript: string
  stop: () => void
  setShowOverlay: (v: boolean) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 animate-fade-in">
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
  )
}
