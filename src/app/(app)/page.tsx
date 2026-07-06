import { IconArrowRight, IconBook2, IconCode, IconLeafFilled, IconTrendingUp } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const FEATURES = [
  { icon: <IconBook2 size={22} />, title: 'Learn' },
  { icon: <IconCode size={22} />, title: 'Practice' },
  { icon: <IconTrendingUp size={22} />, title: 'Improve' }
];

// Most common background pixel in hero.png (sampled) so the illustration blends into the page instead of sitting in a box.
const HERO_BG = '#00121e';

export default function Home() {
  return (
    <div
      className="relative -m-4 grid flex-1 items-center gap-8 overflow-hidden p-4 py-8 sm:gap-10 md:-m-6 md:p-6 lg:grid-cols-2 lg:gap-16"
      style={{ backgroundColor: HERO_BG }}
    >
      <Image
        src="/assets/images/decorator.png"
        alt=""
        width={1344}
        height={1120}
        className="pointer-events-none absolute bottom-0 left-0 hidden w-40 -scale-x-100 opacity-60 sm:block lg:w-56"
      />

      <div className="@container relative mx-auto w-full min-w-0 max-w-xl text-center lg:mx-0 lg:text-left">
        <IconLeafFilled size={32} className="text-primary" />

        <h1 className="mt-4 font-heading text-4xl font-bold text-primary sm:text-5xl">QuickRecall</h1>

        {/* <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          A single place to sharpen your JavaScript, TypeScript, and React interview skills. Pick a topic from the sidebar to get started.
        </p> */}

        <div className="mt-8 grid justify-items-center gap-6 @lg:grid-cols-3 @lg:justify-items-start">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-row items-center justify-center gap-3 @lg:flex-col @lg:items-start @lg:justify-start @lg:gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{f.icon}</div>
              <h3 className="font-heading text-sm font-semibold">{f.title}</h3>
            </div>
          ))}
        </div>

        <Button size="lg" className="mt-8 w-full sm:w-auto" nativeButton={false} render={<Link href="/dashboard" />}>
          Explore topics
          <IconArrowRight size={18} />
        </Button>
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-xs sm:max-w-md lg:max-w-xl">
        <Image src="/assets/images/hero.png" alt="" width={1416} height={1111} priority className="h-auto w-full" />
      </div>
    </div>
  );
}
