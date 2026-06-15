'use client';

import { useMemo, useRef, useState } from 'react';

// third party
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrandYoutube } from '@tabler/icons-react';

// project imports
import { extractPlaylistId } from 'data/video-playlists';

// ==============================|| PLAYLIST PLAYER ||============================== //

// Plays an ordered list of YouTube playlists (by URL) back-to-back in an adaptive frame that flips
// between portrait (Shorts) and landscape (regular videos) per video — see fetchOrientation. The
// native Shorts swipe UI isn't embeddable, so this is the standard IFrame player. The player
// auto-sequences each playlist; when one finishes (IFrame API fires ENDED at the last video of a
// non-looping playlist) we load the next playlist's first video, so the set plays as one feed.

const YT_ENDED = 0; // YT.PlayerState.ENDED
const YT_PLAYING = 1; // YT.PlayerState.PLAYING

type Orientation = 'portrait' | 'landscape';

// Ask YouTube's public oEmbed endpoint for the current video's true pixel dimensions and decide
// the frame orientation. There is no "isShort" flag in the IFrame API, so we infer it from the
// aspect ratio: a Short is portrait (height > width), a regular video is landscape. oEmbed sends
// permissive CORS headers, so a plain browser fetch works without a proxy or API key.
async function fetchOrientation(videoId: string): Promise<Orientation | null> {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: { width?: number; height?: number } = await res.json();
    if (!data.width || !data.height) return null;
    return data.height > data.width ? 'portrait' : 'landscape';
  } catch {
    // Network/CORS failure — caller keeps the current orientation.
    return null;
  }
}

// Fisher-Yates shuffle (returns a new array). Used to randomize the order in which playlists are
// played so each launch starts in a different playlist — the IFrame API can only shuffle within a
// single loaded playlist, so randomizing playlist order is how we vary the cross-playlist start.
function shuffleArray<T>(input: readonly T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Shuffle the loaded playlist and jump to the first item of the freshly-shuffled order.
// setShuffle(true) reorders the queue but leaves the cursor on the original first video, so
// we playVideoAt(0) to actually land on a (new) random video. Without this, every launch would
// start on the same video and the user would have to skip through to reach a later one.
function shuffleAndStart(player: YouTubePlayer | null) {
  if (!player) return;
  try {
    player.setShuffle(true);
    player.playVideoAt(0);
  } catch {
    // Player not fully ready / API shape changed — degrade to default (unshuffled) playback.
  }
}

interface PlaylistPlayerProps {
  playlists: string[]; // ordered playlist URLs
}

export default function PlaylistPlayer({ playlists }: PlaylistPlayerProps) {
  // Resolve URLs → playlist IDs once, dropping anything unparseable, then shuffle the playlist
  // order so each mount starts in a random playlist (combined with per-playlist shuffle on play,
  // this gives a fresh feed every launch). Runs once per mount since deps are just [playlists].
  const ids = useMemo(() => shuffleArray(playlists.map(extractPlaylistId).filter((id): id is string => id !== null)), [playlists]);

  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Last video we've kicked off an orientation lookup for. Guards against re-fetching on every
  // pause/resume (which also fire PLAYING) and against a stale response from a previous video
  // clobbering the current frame after the user has already advanced.
  const lastProbedId = useRef<string | null>(null);

  // Resolve the frame orientation for whatever video is now playing. Reads the id from the player
  // (the IFrame API doesn't tell us which video it auto-advanced to), then asks oEmbed.
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
      // Ignore if the user has since moved on to another video.
      if (result && lastProbedId.current === videoId) setOrientation(result);
    });
  };

  if (ids.length === 0) {
    return (
      <Empty>
        <Typography variant="body2" color="text.secondary">
          No playlist configured.
        </Typography>
      </Empty>
    );
  }

  // Advance to the next playlist when the current one ends. The player instance is reused
  // (loadPlaylist) so there's no iframe remount/flash between playlists.
  const handleStateChange = (event: YouTubeEvent<number>) => {
    // Each new video (incl. the player's own auto-advance within a playlist) reaches PLAYING —
    // re-probe orientation so the frame flips between Shorts (portrait) and regular (landscape).
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
    <Box
      sx={{
        // Frame flips between a portrait phone (Shorts) and a landscape player (regular videos),
        // driven by the detected orientation. Portrait is height-bound (tall, narrow); landscape
        // is width-bound (wide, capped) so neither letterboxes or crops the source.
        position: 'relative',
        mx: 'auto',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'black',
        transition: 'width 0.25s ease, height 0.25s ease',
        ...(orientation === 'portrait'
          ? { width: 'auto', height: 'min(80vh, 720px)', aspectRatio: '9 / 16' }
          : { width: 'min(100%, 1100px)', height: 'auto', aspectRatio: '16 / 9' })
      }}
    >
      <YouTube
        // First playlist seeds the player; subsequent ones load via loadPlaylist on ENDED.
        opts={{
          width: '100%',
          height: '100%',
          playerVars: { listType: 'playlist', list: ids[0], autoplay: 1, rel: 0, modestbranding: 1 }
        }}
        onReady={(e) => {
          playerRef.current = e.target;
          // Shuffle the seed playlist on launch so we open on a random video instead of always
          // the first one. Done here (not via playerVars) because shuffle must be applied after
          // the playlist is loaded into the player.
          shuffleAndStart(e.target);
        }}
        onStateChange={handleStateChange}
        iframeClassName="playlist-iframe"
        style={{ width: '100%', height: '100%' }}
        className="playlist-yt"
      />

      {/* End-of-all-playlists overlay */}
      {finished && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            bgcolor: 'rgba(0,0,0,0.85)',
            color: 'common.white',
            textAlign: 'center',
            px: 3
          }}
        >
          <IconBrandYoutube size={48} />
          <Typography variant="h5" color="inherit">
            That&apos;s the end of the playlist{ids.length > 1 ? 's' : ''}.
          </Typography>
          <Button variant="contained" onClick={restart}>
            Watch again
          </Button>
        </Box>
      )}
    </Box>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 'min(60vh, 480px)' }}>
      {children}
    </Stack>
  );
}
