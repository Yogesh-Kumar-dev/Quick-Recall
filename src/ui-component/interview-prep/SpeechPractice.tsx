'use client';

import { useEffect, useRef, useState } from 'react';

// material-ui
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// icons
import { IconMicrophone, IconPlayerStopFilled, IconArrowRight, IconTrash, IconVideo, IconVideoOff, IconLock } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { predefinedQuestions } from 'data/speak-up-questions';

// ─── Web Speech API minimal typings (not in the TS DOM lib) ─────────────────────

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

// ─── Pulse animation for the mic while listening ────────────────────────────────

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.5); }
  70% { box-shadow: 0 0 0 16px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`;

// ==============================|| SPEECH PRACTICE ||============================== //

interface SpeechPracticeProps {
  // The current question index and advance handler are owned by the Speak Up page so
  // the Q&A bank below can highlight the matching card in sync.
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
    streamRef.current?.getTracks().forEach((track) => track.stop());
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

  // Stop the camera stream on unmount so the webcam light turns off.
  useEffect(() => () => stopCamera(), []);

  return (
    <MainCard border contentSX={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: { xs: 2.5, sm: 3 } }}>
      {/* Question */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="text.secondary">
          Practice answering out loud
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
          {predefinedQuestions[questionIndex].question}
        </Typography>
        <Button size="small" variant="text" endIcon={<IconArrowRight size={16} />} onClick={onNextQuestion} sx={{ mt: 1 }}>
          Next question
        </Button>
      </Box>

      {/* Camera (70%) + mic/transcript (30%).
            A 2-row grid keeps the camera box and transcript box (row 1) bottom-aligned,
            with each column's controls sitting in row 2 below. */}
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          columnGap: 3,
          rowGap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: '60fr 40fr' },
          gridTemplateRows: { md: '1fr auto' }
        }}
      >
        {/* Row 1, left — camera preview */}
        <Box
          sx={(theme) => ({
            gridColumn: { md: 1 },
            gridRow: { md: 1 },
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4 / 3', md: 'auto' },
            minHeight: { md: 300 },
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.text.primary, 0.04),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // mirror, like a real video call
              display: cameraOn ? 'block' : 'none'
            }}
          />
          {!cameraOn && (
            <Stack alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
              <IconVideoOff size={32} />
              <Typography variant="caption">Camera off</Typography>
            </Stack>
          )}
        </Box>

        {/* Row 1, right — mic + transcript */}
        <Box sx={{ gridColumn: { md: 2 }, gridRow: { md: 1 }, width: '100%', display: 'flex', flexDirection: 'column' }}>
          {!supported ? (
            <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
              Speech recognition isn&apos;t supported in this browser — try Chrome or Edge.
            </Typography>
          ) : (
            <Stack alignItems="center" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
              {/* Mic button */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  onClick={handleToggle}
                  aria-label={listening ? 'Stop listening' : 'Start listening'}
                  sx={(theme) => ({
                    width: 72,
                    height: 72,
                    color: '#fff',
                    bgcolor: listening ? theme.palette.error.main : theme.palette.primary.main,
                    animation: listening ? `${pulse} 1.6s infinite` : 'none',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      bgcolor: listening ? theme.palette.error.dark : theme.palette.primary.dark
                    }
                  })}
                >
                  {listening ? <IconPlayerStopFilled size={30} /> : <IconMicrophone size={30} />}
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {listening ? 'Listening… click to stop' : 'Click the mic and start speaking your answer'}
                </Typography>
              </Stack>

              {errorMsg && (
                <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                  {errorMsg}
                </Typography>
              )}

              {/* Transcript — grows to fill the column, scrolls only when overflowing */}
              <Box
                sx={(theme) => ({
                  width: '100%',
                  flexGrow: 1,
                  minHeight: { xs: 140, md: 0 },
                  overflowY: 'auto',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                })}
              >
                {transcript || interim ? (
                  <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {transcript}
                    {interim && (
                      <Typography component="span" color="text.secondary">
                        {transcript ? ' ' : ''}
                        {interim}
                      </Typography>
                    )}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Your words will appear here as you speak…
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </Box>

        {/* Row 2, left — camera controls */}
        <Stack alignItems="center" spacing={1} sx={{ gridColumn: { md: 1 }, gridRow: { md: 2 }, width: '100%' }}>
          <Button
            variant="outlined"
            color={cameraOn ? 'error' : 'primary'}
            size="small"
            startIcon={cameraOn ? <IconVideoOff size={18} /> : <IconVideo size={18} />}
            onClick={handleToggleCamera}
          >
            {cameraOn ? 'Turn camera off' : 'Turn camera on'}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textAlign: 'center' }}
          >
            <IconLock size={13} />
            Live preview only — your video stays on your device and is never recorded or saved.
          </Typography>

          {cameraError && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
              {cameraError}
            </Typography>
          )}
        </Stack>

        {/* Row 2, right — clear (top-aligned so it sits just below the transcript,
              matching the camera button's spacing instead of floating in a tall cell) */}
        {supported && (
          <Box sx={{ gridColumn: { md: 2 }, gridRow: { md: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<IconTrash size={18} />}
              onClick={handleClear}
              disabled={!transcript && !interim}
            >
              Clear
            </Button>
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
