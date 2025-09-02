import { useEffect, useState } from 'preact/hooks';

interface VolumeSliderProps {
    /** Current volume (0-100) */
    volume: number;
    accentColor?: string;
    onChange?: (newVolume: number) => void;
}

export function VolumeSlider({ volume, accentColor, onChange }: VolumeSliderProps) {
    const [internalVolume, setInternalVolume] = useState(volume);

    // Keep local slider in sync with external volume (from server/polling)
    useEffect(() => {
        setInternalVolume(volume);
    }, [volume]);

    return (
        <input
            type="range"
            min={0}
            max={100}
            value={internalVolume}
            step={1}
            onInput={e => onChange?.(Number((e.target as HTMLInputElement).value))}
            style={{ width: '100%', accentColor: accentColor, cursor: 'pointer' }}
        />
    );
}