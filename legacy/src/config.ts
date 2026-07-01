// third party
import { Inter, Lora, Source_Code_Pro } from 'next/font/google';

// types
import type { ConfigProps } from 'types/config';

export const DASHBOARD_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 7;

// MongoDB (LeafyGreen) typeface stand-ins — the brand fonts (Euclid Circular A, MongoDB
// Value Serif) are proprietary, so we approximate with free Google Fonts. Source Code Pro
// is the exact LeafyGreen code font. Swap to next/font/local here if licensed files arrive.
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] }); // body — Euclid Circular A stand-in
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'] }); // headings — MongoDB Value Serif stand-in
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], weight: ['400', '500', '600'] }); // code — exact LeafyGreen mono

// Exposed for typography.tsx (serif H1/H2) and code surfaces (Monaco viewer, <code>).
export const headingFont = lora.style.fontFamily;
export const monoFont = sourceCodePro.style.fontFamily;

export enum MenuOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum DropzopType {
  default = 'DEFAULT',
  standard = 'STANDARD'
}

const config: ConfigProps = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: inter.style.fontFamily,
  borderRadius: 6,
  outlinedFilled: true,
  mode: ThemeMode.DARK,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: true
};

export default config;
