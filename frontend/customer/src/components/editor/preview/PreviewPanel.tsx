import React from 'react';
import {
  Device,
  EventData,
  MediaData,
  GuestData,
  LoveStoryMilestone,
  StreamingConfig,
  SocialConfig,
  GreetingItem,
} from '../../../types';
import { Ic } from '../../common/Icons';
import { InvitePreview } from './InvitePreview';

interface PreviewPanelProps {
  event: EventData;
  media: MediaData;
  guests?: GuestData;
  loveStory?: LoveStoryMilestone[];
  streaming?: StreamingConfig;
  social?: SocialConfig;
  greetingsList?: GreetingItem[];
  device: Device;
  onDeviceChange: (d: Device) => void;
}

export function PreviewPanel({
  event,
  media,
  guests,
  loveStory,
  streaming,
  social,
  greetingsList,
  device,
  onDeviceChange,
}: PreviewPanelProps) {
  const frameStyles: Record<Device, { outer: string; inner: string; notch: boolean }> = {
    mobile: {
      outer: 'w-[230px] h-[460px] rounded-[34px] border-[10px] border-inverse-surface shadow-2xl relative',
      inner: 'rounded-[24px] overflow-hidden',
      notch: true,
    },
    tablet: {
      outer: 'w-[320px] h-[450px] rounded-2xl border-[10px] border-inverse-surface shadow-2xl relative',
      inner: 'rounded-xl overflow-hidden',
      notch: false,
    },
    desktop: {
      outer: 'w-[380px] h-[270px] rounded-xl border-[10px] border-inverse-surface shadow-2xl relative',
      inner: 'rounded-sm overflow-hidden',
      notch: false,
    },
  };

  const f = frameStyles[device];

  return (
    <div className="flex flex-col items-center gap-4 pt-6 pb-8 px-4">
      {/* Device switcher */}
      <div className="flex items-center gap-1 bg-surface-container rounded-full p-1 shadow-2xs">
        {(
          [
            ['mobile', Ic.Phone],
            ['tablet', Ic.Tablet],
            ['desktop', Ic.Monitor],
          ] as [Device, typeof Ic.Phone][]
        ).map(([d, Icon]) => (
          <button
            key={d}
            type="button"
            onClick={() => onDeviceChange(d)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              device === d
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon s={14} />
            <span className="capitalize">{d}</span>
          </button>
        ))}
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
        Live Preview Interaktif
      </div>

      {/* Device frame */}
      <div className={f.outer}>
        {f.notch && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-inverse-surface rounded-b-2xl z-10" />
        )}
        <div className={`${f.inner} w-full h-full bg-surface overflow-hidden`} style={{ position: 'relative' }}>
          <InvitePreview
            event={event}
            media={media}
            guests={guests}
            loveStory={loveStory}
            streaming={streaming}
            social={social}
            greetingsList={greetingsList}
          />
        </div>
      </div>

      <p className="text-xs text-on-surface-variant text-center max-w-[280px] leading-relaxed">
        Preview diperbarui secara otomatis secara real-time setiap perubahan data form di sebelah kiri.
      </p>
    </div>
  );
}
