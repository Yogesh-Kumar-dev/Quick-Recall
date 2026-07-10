'use client';

import { IconBrandYoutube } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { extractPlaylistId } from '@/data/video-playlists';

// ==============================|| PLAYLIST PLAYER ||============================== //

// Plays playlists back-to-back in a frame that flips portrait/landscape per video (Shorts vs
// regular) since the IFrame API has no "isShort" flag — see fetchOrientation.

const YT_ENDED = 0;
const YT_PLAYING = 1;

type Orientation = 'portrait' | 'landscape';

// No "isShort" flag in the IFrame API, so infer orientation from oEmbed's reported pixel dimensions.
async function fetchOrientation(videoId: string): Promise<Orientation | null> {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: { width?: number; height?: number } = await res.json();
    if (!data.width || !data.height) return null;
    return data.height > data.width ? 'portrait' : 'landscape';
  } catch {
    return null;
  }
}

// Fisher-Yates shuffle. The IFrame API can only shuffle within a single loaded playlist, so
// randomizing playlist order here is how cross-playlist start position varies.
function shuffleArray<T>(input: readonly T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// setShuffle(true) reorders the queue but leaves the cursor on the original first video, so
// playVideoAt(0) is needed to actually land on a random one.
function shuffleAndStart(player: YouTubePlayer | null) {
  if (!player) return;
  try {
    player.setShuffle(true);
    player.playVideoAt(0);
  } catch {
    // player not ready / API shape changed — fall back to default playback
  }
}

interface PlaylistPlayerProps {
  playlists: string[];
}

export default function PlaylistPlayer({ playlists }: PlaylistPlayerProps) {
  const ids = useMemo(() => shuffleArray(playlists.map(extractPlaylistId).filter((id): id is string => id !== null)), [playlists]);

  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Guards against re-fetching on pause/resume (also fires PLAYING) and against a stale response
  // clobbering the frame after the user has advanced.
  const lastProbedId = useRef<string | null>(null);

  const probeOrientation = (player: YouTubePlayer | null) => {
    if (!player) return;
    let videoId: string | undefined;
    try {
      videoId = player.getVideoData?.()?.video_id;
    } catch {
      return;
    }
    if (!videoId || videoId === lastProbedId.current) return;
    lastProbedId.current = videoId;
    fetchOrientation(videoId).then((result) => {
      if (result && lastProbedId.current === videoId) setOrientation(result);
    });
  };

  if (ids.length === 0) {
    return (
      <div className="flex h-[min(60vh,480px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">No playlist configured.</p>
      </div>
    );
  }

  const handleStateChange = (event: YouTubeEvent<number>) => {
    if (event.data === YT_PLAYING) {
      probeOrientation(event.target);
      return;
    }
    if (event.data !== YT_ENDED) return;
    const next = current + 1;
    if (next < ids.length) {
      setCurrent(next);
      event.target.loadPlaylist({ list: ids[next], listType: 'playlist', index: 0 });
      shuffleAndStart(event.target);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setFinished(false);
    setCurrent(0);
    playerRef.current?.loadPlaylist({ list: ids[0], listType: 'playlist', index: 0 });
    shuffleAndStart(playerRef.current);
  };

  return (
    <div
      className={
        'relative mx-auto overflow-hidden rounded-lg bg-black transition-[width,height] duration-200 ' +
        (orientation === 'portrait'
          ? 'h-[min(80dvh,720px)] w-auto aspect-[9/16]'
          : // width also capped via the 16:9 ratio of (100dvh - chrome), so derived height can
            // never outgrow the sheet and force a scrollbar
            'h-auto w-[min(100%,1100px,calc((100dvh-140px)*16/9))] aspect-video')
      }
    >
      <YouTube
        opts={{
          width: '100%',
          height: '100%',
          playerVars: { listType: 'playlist', list: ids[0], autoplay: 1, rel: 0, modestbranding: 1 }
        }}
        onReady={(e) => {
          playerRef.current = e.target;
          // must shuffle after the playlist is loaded into the player, not via playerVars
          shuffleAndStart(e.target);
        }}
        onStateChange={handleStateChange}
        title="Interview-prep video playlist"
        style={{ width: '100%', height: '100%' }}
      />

      {finished && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 px-6 text-center text-white">
          <IconBrandYoutube size={48} />
          <p className="text-lg font-semibold">That&apos;s the end of the playlist{ids.length > 1 ? 's' : ''}.</p>
          <Button onClick={restart}>Watch again</Button>
        </div>
      )}
    </div>
  );
}
