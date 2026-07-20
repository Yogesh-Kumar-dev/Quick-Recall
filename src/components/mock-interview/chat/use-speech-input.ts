import { useEffect, useRef, useState } from 'react';
import { getSpeechRecognition, type SpeechRecognitionLike } from '@/lib/speech-recognition';

// Web Speech API mic toggle, lifted out of the old AnswerRecorder so ChatInput doesn't grow its
// own copy — same behavior (continuous + interim results, degrade to unsupported on e.g. Firefox).
// `enabled` skips setting up recognition entirely for chat steps that never show the mic button.
export function useSpeechInput(onFinalChunk: (text: string) => void, enabled: boolean) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalChunkRef = useRef(onFinalChunk);
  onFinalChunkRef.current = onFinalChunk;

  useEffect(() => {
    if (!enabled) return;
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalChunk += text;
        else interimChunk += text;
      }
      if (finalChunk) onFinalChunkRef.current(finalChunk.trim());
      setInterim(interimChunk);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMsg('Microphone access was blocked.');
      } else if (event.error === 'no-speech') {
        setErrorMsg("Didn't catch that — try again.");
      } else if (event.error === 'network') {
        setErrorMsg('Speech recognition needs a network connection.');
      } else {
        setErrorMsg('Something went wrong with speech recognition.');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // ignore — recognition may not be running
      }
    };
  }, [enabled]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    setErrorMsg('');
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if already started — ignore
    }
  };

  return { listening, interim, supported, errorMsg, toggleListening };
}
