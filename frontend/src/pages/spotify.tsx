import { useEffect, useState, useRef } from "preact/hooks";
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
import {
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconPlayerPauseFilled,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconArrowsShuffle,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-preact";

interface SpotifyData {
  album_img: string;
  artist: string;
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

  useEffect(() => {
    // Poll server every 900ms
    let isMounted = true;
    const fetchStatus = async () => {
      const data = await getStatus();
      if (isMounted) {
        setStatus(data);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 900);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-4 items-center">
        <div>
          {status ? (
            <div>
              <div class="aspect-video w-full max-w-2xl">
                <img
                  style={{ width: "35%" }}
                  src={status.album_img}
                  alt={status.name}
                />
              </div>
              <div>
                {status.artist} - {status.name}
              </div>
              <div>
                <MediaProgressBar
                  progress={status.progress}
                  duration={status.duration}
                  playing={status.playing}
                  onSeek={(newTime) => seek(newTime)}
                  accentColor="#1DB954"
                />
              </div>
              <div>
                <button onClick={() => previousTrack()}>
                  <IconPlayerTrackPrevFilled />
                </button>

                <button onClick={() => (status.playing ? pause() : play())}>
                  {status.playing ? (
                    <IconPlayerPauseFilled />
                  ) : (
                    <IconPlayerPlayFilled />
                  )}
                </button>

                <button onClick={() => nextTrack()}>
                  <IconPlayerTrackNextFilled />
                </button>
              </div>
              <div>
                <button onClick={() => {
                  const nextIndex = (repeatIndex + 1) % repeatStates.current.length;
                  setRepeatIndex(nextIndex);
                  setRepeat(repeatStates.current[nextIndex]);
                }}>
                  {repeatStates.current[repeatIndex] === 'off' && <IconRepeatOff />}
                  {repeatStates.current[repeatIndex] === 'context' && <IconRepeat />}
                  {repeatStates.current[repeatIndex] === 'track' && <IconRepeatOnce />}
                </button>
                <button onClick={() => {
                  const newState = !shuffle;
                  setShuffle(newState);
                  toggleShuffle(newState);
                }}>
                  <IconArrowsShuffle color={shuffle ? '#1DB954' : undefined} />
                </button>

              </div>
          
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
}
