import { useState, useCallback } from 'react'

export function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const speed = parseFloat(localStorage.getItem('vinatask-voice-speed') || '1')
    utterance.rate = speed
    utterance.pitch = 1
    utterance.lang = 'en-US'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}
