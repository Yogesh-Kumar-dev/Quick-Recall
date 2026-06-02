// material-ui
import Box from '@mui/material/Box';

// project imports
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Topics from './Topics';
import Highlights from './Highlights';
import CallToAction from './CallToAction';
import Footer from './Footer';

// ==============================|| LANDING PAGE ||============================== //

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main">
        <Hero />
        <Stats />
        <Topics />
        <Highlights />
        <CallToAction />
      </Box>
      <Footer />
    </Box>
  );
}
