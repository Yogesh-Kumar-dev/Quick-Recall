// material-ui
import Box from '@mui/material/Box';

// project imports
import Hero from './Hero';

// ==============================|| LANDING PAGE ||============================== //

// Comic Sans is a system font (not on Google Fonts); apply via CSS with comic-style fallbacks.
// `!important` is required: MUI bakes the theme fontFamily into every Typography variant class,
// which would otherwise win over a plain descendant rule.
const COMIC_SANS = '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive !important';

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', '&, & *': { fontFamily: COMIC_SANS } }}>
      <Box component="main">
        <Hero />
      </Box>
    </Box>
  );
}
