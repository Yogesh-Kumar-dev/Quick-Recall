// project import
// import GuestGuard from 'utils/route-guard/GuestGuard';  // v1: auth disabled
// import Login from 'views/pages/authentication/Login';   // v1: auth disabled
import LandingPage from 'views/landing-page';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  return (
    // <GuestGuard><Login /></GuestGuard>  {/* re-enable for auth */}
    <LandingPage />
  );
}
