import { useEffect, useState } from 'preact/hooks';

interface VolumeSliderProps {
    /** Current volume (0-100) */
    volume: number;
    accentColor?: string;
    onChange?: (newVolume: number) => void;
    /** Orientation of the slider */
    orientation?: 'horizontal' | 'vertical';
    /** Length of the slider in px for the main axis */
    lengthPx?: number;
    className?: string;
}

export function VolumeSlider({ volume, accentColor, onChange, orientation = 'horizontal', lengthPx, className }: VolumeSliderProps) {
    const [internalVolume, setInternalVolume] = useState(volume);

    // Keep local slider in sync with external volume (from server/polling)
    useEffect(() => {
        setInternalVolume(volume);
    }, [volume]);

    const commonInput = (
        <input
            type="range"
            min={0}
            max={100}
            value={internalVolume}
            step={1}
            onInput={e => onChange?.(Number((e.target as HTMLInputElement).value))}
            style={{ accentColor: accentColor, cursor: 'pointer' }}
        />
    );

    if (orientation === 'vertical') {
        const len = lengthPx ?? 160;
        // Rotate the input and constrain its layout via wrapper
        return (
            <div
                className={className}
                style={{
                    height: len,
                    width: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center',
                        width: len,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {commonInput}
                </div>
            </div>
        );
    }

    // Horizontal (default)
    return (
        <div className={className} style={{ width: lengthPx ? `${lengthPx}px` : '100%' }}>
            {commonInput}
        </div>
    );
}
