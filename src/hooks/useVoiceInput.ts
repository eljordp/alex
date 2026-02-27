import { useState, useRef, useCallback } from 'react'

interface UseVoiceInputOptions {
  onResult: (transcript: string) => void
  onError?: () => void
}

// Extend window for webkit speech recognition
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript: string }
      isFinal: boolean
    }
    length: number
  }
}

export function useVoiceInput({ onResult, onError }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null)

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  )

  const start = useCallback(() => {
    if (!isSupported) {
      onError?.()
      return
    }

    const recognition = createRecognition()
    if (!recognition) {
      onError?.()
      return
    }

    recognitionRef.current = recognition
    setTranscript('')
    setIsListening(true)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)

      if (finalTranscript) {
        setIsListening(false)
        onResult(finalTranscript.trim())
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      onError?.()
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [isSupported, onResult, onError])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return { start, stop, transcript, isListening, isSupported }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRecognition(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  return recognition
}
