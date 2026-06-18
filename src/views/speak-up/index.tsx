'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import SpeechPractice from 'ui-component/interview-prep/SpeechPractice';
import AiVoiceTools from 'ui-component/interview-prep/AiVoiceTools';
import QAPracticeBank from './QAPracticeBank';

import { predefinedQuestions } from 'data/speak-up-questions';

// ==============================|| SPEAK UP PAGE ||============================== //

export default function SpeakUpPage() {
  // Single source of truth for the current question — shared between the rehearsal
  // tool (advances it via "Next question") and the question bank (click to select /
  // highlight the matching row).
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleNextQuestion = () => setQuestionIndex((prev) => (prev + 1) % predefinedQuestions.length);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Speak Up
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice speaking your answers out loud, then build a personal bank of questions and prepared answers to rehearse.
        </Typography>
      </Box>

      {/* YouTube-style layout: rehearsal tool (player) on the left, question bank
          ("up next") on the right. Below the md breakpoint the bank stacks underneath. */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          // Stretch so the bank column matches the player card's height and their
          // bottoms line up; the bank scrolls internally past that point.
          alignItems: { xs: 'start', md: 'stretch' },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(300px, 360px)' }
        }}
      >
        {/* minWidth:0 lets each grid item shrink below its content's intrinsic width — without it,
            long question text / answers push the track wider than the viewport (mobile overflow). */}
        <Box sx={{ minWidth: 0 }}>
          <SpeechPractice questionIndex={questionIndex} onNextQuestion={handleNextQuestion} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <QAPracticeBank activeIndex={questionIndex} onSelectQuestion={setQuestionIndex} />
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Related — AI voice partners (full width, below the player) */}
      <AiVoiceTools />
    </Box>
  );
}
