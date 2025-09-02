import { useEffect, useState } from 'preact/hooks';

interface MediaSliderProps {
  /** Current progress in seconds */
  progress: number;
  /** Total duration in seconds */
  duration: number;
  /** Fired when the user seeks */
  onSeek?: (newTime: number) => void;
  /** Indicates whether playback is running */
  playing: boolean;
  /** Accent color for the slider */
  accentColor?: string;
  [x: string]: any;
}

/**
 * A responsive media progress bar/slider for Preact.
 */
export function MediaProgressBar({
  progress,
  duration,
  onSeek,
  playing,
  accentColor = '#4f46e5',
}: MediaSliderProps) {
  const [internalProgress, setInternalProgress] = useState(progress);

  // Keep local slider in sync with external progress (from server/polling)
  useEffect(() => {
    setInternalProgress(progress);
  }, [progress]);

  // Increment progress locally while playing (every second)
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setInternalProgress((val) => (val < duration ? val + 1 : val));
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, duration]);

  // Format seconds as mm:ss
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${('0' + s).slice(-2)}`;
  }

  return (
    <div style={{ width: '100%' }}>
      <input
        type="range"
        min={0}
        max={duration}
        value={internalProgress}
        step={1}
        onInput={e => setInternalProgress(Number((e.target as HTMLInputElement).value))}
        onChange={e => onSeek?.(Number((e.target as HTMLInputElement).value))}
        style={{ width: '100%', accentColor: accentColor, cursor: 'pointer' }}
        aria-label="Audio progress"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span>{formatTime(internalProgress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}