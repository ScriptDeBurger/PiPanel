import { useEffect, useState, useRef } from "preact/hooks";
import { useCallback } from "preact/hooks";
import {
  getStatus,
  play,
  pause,
  previousTrack,
  nextTrack,
  seek,
  toggleShuffle,
  setRepeat,
  setVolume,
} from "./spotifyApi";
import { MediaProgressBar } from "../components/MediaProgressBar";
import { VolumeSlider } from "../components/VolumeSlider";
import {
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconPlayerPause,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconArrowsShuffle,
  IconVolume,
  IconVolume2,
  IconVolumeOff,
} from "@tabler/icons-preact";
import { getAverageColor } from "./fac";
import "./spotify.css";

interface SpotifyData {
  album_img: string;
  artist: string;
  album?: string;
  name: string;
  progress: number;
  duration: number;
  playing: boolean;
}

export function SpotifyControls() {
  const [status, setStatus] = useState<SpotifyData | null>(null);
  const repeatStates = useRef<("off" | "context" | "track")[]>([
    "off",
    "context",
    "track",
  ]);
  const [repeatIndex, setRepeatIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [showVolume, setShowVolume] = useState(false);
  const [bgColor, setBgColor] = useState<string>("#3a3636ff"); // default background
  const colorCache = useRef<Map<string, string>>(new Map());
  const volumeDebounceRef = useRef<number | null>(null);
  const isFetchingRef = useRef(false);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = status?.album_img;
    if (url) {
      const cached = colorCache.current.get(url);
      if (cached) {
        setBgColor(cached);
      } else {
        getAverageColor(url)
          .then((color) => {
            if (!cancelled) {
              colorCache.current.set(url, color);
              setBgColor(color);
            }
          })
          .catch(() => {
            if (!cancelled) setBgColor("#3a3636ff"); // fallback
          });
      }
    }
    return () => {
      cancelled = true;
    };
  }, [status?.album_img]);

  const refreshStatus = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (_) {
      // ignore; next tick will retry
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Track page visibility to pause polling when hidden
  const [pageVisible, setPageVisible] = useState(
    typeof document !== "undefined"
      ? document.visibilityState !== "hidden"
      : true
  );
  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Adaptive polling: slower when paused, paused when tab hidden
  useEffect(() => {
    let timer: number | null = null;
    if (!pageVisible) return; // don't poll when hidden

    // Fetch once immediately when becoming visible or on mount
    refreshStatus();

    const interval = status?.playing ? 5000 : 15000; // 5s while playing, 15s when paused
    timer = window.setInterval(() => {
      refreshStatus();
    }, interval);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pageVisible, status?.playing, refreshStatus]);

  const handlePrev = useCallback(async () => {
    await previousTrack();
    refreshStatus();
  }, [refreshStatus]);
  const handleNext = useCallback(async () => {
    await nextTrack();
    refreshStatus();
  }, [refreshStatus]);
  const handlePlayPause = useCallback(
    async (playing: boolean | undefined) => {
      if (playing) await pause();
      else await play();
      refreshStatus();
    },
    [refreshStatus]
  );
  const handleSeek = useCallback(async (newTime: number) => {
    await seek(newTime);
    // Optimistically update local state to reflect seek immediately
    setStatus((prev) => (prev ? { ...prev, progress: newTime } : prev));
  }, []);
  const handleRepeatToggle = useCallback(() => {
    const nextIndex = (repeatIndex + 1) % repeatStates.current.length;
    setRepeatIndex(nextIndex);
    setRepeat(repeatStates.current[nextIndex]);
  }, [repeatIndex]);
  const handleShuffleToggle = useCallback(() => {
    setShuffle((prev) => {
      const next = !prev;
      toggleShuffle(next);
      return next;
    });
  }, []);
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (volumeDebounceRef.current) {
      clearTimeout(volumeDebounceRef.current);
    }
    volumeDebounceRef.current = window.setTimeout(() => {
      setVolume(newVolume);
    }, 150);
  }, []);
  useEffect(
    () => () => {
      if (volumeDebounceRef.current) clearTimeout(volumeDebounceRef.current);
    },
    []
  );

  // Close volume popover on outside click or Escape key
  useEffect(() => {
    if (!showVolume) return;
    const onPointerDown = (e: Event) => {
      const target = e.target as Node | null;
      const container = volumeContainerRef.current;
      if (container && target && !container.contains(target)) {
        setShowVolume(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVolume(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showVolume]);

  return (
    <div className="spotify-page" style={{ backgroundColor: bgColor }}>
      <div className="spotify-shadow" />

      <div className="spotify-content">
        {status ? (
          <div className="spotify-hero">
            <div className="spotify-hero-row">
              <img className="spotify-cover" src={status.album_img} alt={status.name} />
              <div className="spotify-meta">
                <div className="spotify-artist">
                  {status.artist}
                  {status.album && <div className="spotify-album">{status.album}</div>}
                </div>
                <div className="spotify-title">{status.name}</div>
              </div>
            </div>
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      {status && (
        <div className="spotify-controls">
          <div className="spotify-controls-inner">
          <div className="spotify-controls-row">
            <button onClick={handleShuffleToggle}>
              <IconArrowsShuffle />
            </button>
            <button onClick={handlePrev}>
              <IconPlayerTrackPrev />
            </button>
            <button onClick={() => handlePlayPause(status?.playing)}>
              {status.playing ? <IconPlayerPause /> : <IconPlayerPlay />}
            </button>
            <button onClick={handleNext}>
              <IconPlayerTrackNext />
            </button>
            <button onClick={handleRepeatToggle}>
              {repeatStates.current[repeatIndex] === "off" && <IconRepeatOff />}
              {repeatStates.current[repeatIndex] === "context" && <IconRepeat />}
              {repeatStates.current[repeatIndex] === "track" && <IconRepeatOnce />}
            </button>
          </div>
          </div>
          <div className="spotify-progress">
            <MediaProgressBar
              progress={status.progress}
              duration={status.duration}
              playing={status.playing}
              onSeek={handleSeek}
              accentColor="#ddd"
            />
          </div>
        </div>
      )}
      <div className="spotify-volume" ref={volumeContainerRef}>
        {showVolume && (
          <div className="spotify-volume-popover">
            <VolumeSlider
              orientation="vertical"
              lengthPx={160}
              volume={volume}
              accentColor="#1DB954"
              onChange={handleVolumeChange}
            />
          </div>
        )}
        <button
          className="spotify-volume-toggle"
          onClick={() => setShowVolume((v) => !v)}
          aria-label="Volume"
        >
          {volume === 0 ? <IconVolumeOff /> : volume < 50 ? <IconVolume2 /> : <IconVolume />}
        </button>
      </div>
    </div>
  );
}
