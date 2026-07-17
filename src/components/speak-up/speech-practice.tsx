'use client';

import { ArrowRight, Lock, Mic, Square, Trash2, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getSpeechRecognition, type SpeechRecognitionLike } from '@/lib/speech-recognition';
import { predefinedQuestions } from '@/data/speak-up-questions';

// ==============================|| SPEECH PRACTICE ||============================== //

interface SpeechPracticeProps {
  questionIndex: number;
  onNextQuestion: () => void;
}

export default function SpeechPractice({ questionIndex, onNextQuestion }: SpeechPracticeProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
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
      if (finalChunk) setTranscript((prev) => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
      setInterim(interimChunk);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMsg('Microphone access was blocked. Please allow microphone permission and try again.');
      } else if (event.error === 'no-speech') {
        setErrorMsg("Didn't catch that — try speaking a bit louder.");
      } else if (event.error === 'audio-capture') {
        setErrorMsg('No microphone was found. Please connect a mic and try again.');
      } else if (event.error === 'network') {
        setErrorMsg('Speech recognition needs a network connection to Google — check your connection or ad blocker.');
      } else {
        setErrorMsg('Something went wrong with speech recognition. Please try again.');
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
  }, []);

  const handleToggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }

    setErrorMsg('');
    setInterim('');
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if already started — ignore
    }
  };

  const handleClear = () => {
    setTranscript('');
    setInterim('');
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const handleToggleCamera = async () => {
    if (cameraOn) {
      stopCamera();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access isn’t supported in this browser.');
      return;
    }

    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setCameraError('Camera access was blocked. Please allow camera permission and try again.');
      } else if (name === 'NotFoundError') {
        setCameraError('No camera was found on this device.');
      } else {
        setCameraError('Couldn’t start the camera. Please try again.');
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: unmount-only cleanup; stopCamera isn't memoized
  useEffect(() => () => stopCamera(), []);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-6">
        <style>{`@keyframes speakup-pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.5); }
          70% { box-shadow: 0 0 0 16px rgba(244, 67, 54, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }`}</style>

        <div className="min-w-0 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Practice answering out loud</p>
          <h4 className="mt-1 text-lg font-bold break-words">{predefinedQuestions[questionIndex].question}</h4>
          <Button variant="ghost" size="sm" className="mt-1 gap-1.5" onClick={onNextQuestion}>
            Next question <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="relative mx-auto aspect-video w-full max-w-[640px] overflow-hidden rounded-xl border bg-neutral-900">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn('size-full -scale-x-100 object-cover', cameraOn ? 'block' : 'hidden')}
          />

          {!cameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white/65">
              <VideoOff className="size-8" />
              <span className="text-xs">Camera off</span>
            </div>
          )}

          <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
            {supported && (
              <button
                type="button"
                onClick={handleToggle}
                aria-label={listening ? 'Stop answering' : 'Start answering'}
                title={listening ? 'Stop answering' : 'Start answering'}
                style={listening ? { animation: 'speakup-pulse 1.6s infinite' } : undefined}
                className={cn(
                  'flex size-13 items-center justify-center rounded-full text-white transition-colors',
                  listening ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'
                )}
              >
                {listening ? <Square className="size-6 fill-current" /> : <Mic className="size-6" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleToggleCamera}
              aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
              title={cameraOn ? 'Turn camera off' : 'Turn camera on'}
              className="flex size-11 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/24"
            >
              {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-1 text-center">
          {!supported && (
            <p className="text-sm text-destructive">Speech recognition isn&apos;t supported in this browser — try Chrome or Edge.</p>
          )}
          {supported && (
            <p className="text-sm text-muted-foreground">
              {listening ? 'Listening… speak your answer' : 'Press Start answering and speak out loud'}
            </p>
          )}
          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
          {cameraError && <p className="text-sm text-destructive">{cameraError}</p>}
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" />
            Live preview only — your video stays on your device and is never recorded or saved.
          </p>
        </div>

        {supported && (
          <div className="w-full">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold">Live transcription</span>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleClear} disabled={!transcript && !interim}>
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
            <div className="max-h-70 min-h-30 w-full overflow-y-auto rounded-lg border bg-primary/5 p-4">
              {transcript || interim ? (
                <p className="leading-relaxed whitespace-pre-wrap">
                  {transcript}
                  {interim && (
                    <span className="text-muted-foreground">
                      {transcript ? ' ' : ''}
                      {interim}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-muted-foreground italic">Your words will appear here as you speak…</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
