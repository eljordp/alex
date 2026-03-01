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
  // Track accumulated final transcript across recognition restarts
  const accumulatedRef = useRef('')
  // Flag so we know if user explicitly stopped vs browser killed it
  const stoppedByUserRef = useRef(false)
  // Track if we're supposed to be listening (survives restarts)
  const activeRef = useRef(false)

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  )

  const startRecognition = useCallback(() => {
    const recognition = createRecognition()
    if (!recognition) {
      onError?.()
      return
    }

    recognitionRef.current = recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      // Update accumulated with any new final text
      if (finalText) {
        accumulatedRef.current = (accumulatedRef.current + ' ' + finalText).trim()
      }

      // Show accumulated + any interim text
      const display = interimText
        ? (accumulatedRef.current + ' ' + interimText).trim()
        : accumulatedRef.current
      setTranscript(display)
    }

    recognition.onerror = (e: { error: string }) => {
      // "no-speech" and "aborted" are not real errors — just restart
      if (e.error === 'no-speech' || e.error === 'aborted') return
      activeRef.current = false
      setIsListening(false)
      onError?.()
    }

    recognition.onend = () => {
      // If user didn't stop and we're still supposed to be active, auto-restart
      if (activeRef.current && !stoppedByUserRef.current) {
        try {
          const next = createRecognition()
          if (next) {
            recognitionRef.current = next
            next.onresult = recognition.onresult
            next.onerror = recognition.onerror
            next.onend = recognition.onend
            next.start()
            return
          }
        } catch {
          // Fall through to stop
        }
      }

      // If user stopped via "Done" and we have transcript, fire result
      if (stoppedByUserRef.current && accumulatedRef.current) {
        onResult(accumulatedRef.current.trim())
      }

      setIsListening(false)
      activeRef.current = false
    }

    try {
      recognition.start()
    } catch {
      onError?.()
    }
  }, [onResult, onError])

  const start = useCallback(() => {
    if (!isSupported) {
      onError?.()
      return
    }

    accumulatedRef.current = ''
    stoppedByUserRef.current = false
    activeRef.current = true
    setTranscript('')
    setIsListening(true)
    startRecognition()
  }, [isSupported, onError, startRecognition])

  const stop = useCallback(() => {
    stoppedByUserRef.current = true
    activeRef.current = false

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // If we have accumulated text, fire immediately (onend might not fire on some browsers)
    if (accumulatedRef.current) {
      setIsListening(false)
      onResult(accumulatedRef.current.trim())
    } else {
      setIsListening(false)
    }
  }, [onResult])

  // Cancel: stop without firing onResult
  const cancel = useCallback(() => {
    stoppedByUserRef.current = true
    activeRef.current = false
    accumulatedRef.current = ''

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    setIsListening(false)
    setTranscript('')
  }, [])

  return { start, stop, cancel, transcript, isListening, isSupported }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRecognition(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = true
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  return recognition
}
