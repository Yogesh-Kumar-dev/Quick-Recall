'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

// third party
import { IntlProvider, type MessageFormatElement } from 'react-intl';
import useConfig from 'hooks/useConfig';

// English messages are imported statically so they're available synchronously on the server and the
// first client render. The other locales stay dynamically imported (loaded on demand when selected).
import enMessages from 'utils/locales/en.json';

// types
import type { I18n } from 'types/config';

type Messages = Record<string, string> | Record<string, MessageFormatElement[]>;

// load locales files
function loadLocaleData(i18n: I18n): Promise<{ default: Messages }> {
  switch (i18n) {
    case 'fr':
      return import('utils/locales/fr.json');
    case 'ro':
      return import('utils/locales/ro.json');
    case 'zh':
      return import('utils/locales/zh.json');
    default:
      return import('utils/locales/en.json');
  }
}

// ==============================|| LOCALIZATION ||============================== //

interface LocalsProps {
  children: React.ReactNode;
}

export default function Locales({ children }: LocalsProps) {
  const { i18n } = useConfig();
  // Seed with English so children always render — including on the server. Previously messages
  // started undefined and was only set by a client effect, which gated the ENTIRE app tree out of
  // SSR (empty server HTML; everything painted only after hydration → LCP ~6.6s). The default
  // locale is English, so the seed is correct for the common case; non-English locales swap in
  // below once their chunk loads.
  const [messages, setMessages] = useState<Messages>(enMessages as Messages);

  useEffect(() => {
    if (i18n === 'en') return; // already seeded with the static English import
    let active = true;
    loadLocaleData(i18n).then((d) => {
      if (active) setMessages(d.default);
    });
    return () => {
      active = false;
    };
  }, [i18n]);

  return (
    <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
}
