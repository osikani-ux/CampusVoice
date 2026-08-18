interface IconProps {
  className?: string;
}

const base = (className?: string) => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Megaphone = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 10v4a1 1 0 0 0 1 1h2l4 4V5L6 9H4a1 1 0 0 0-1 1Z" />
    <path d="M10 7c4-2 7-3 11-3-1 3-1 13 0 16-4 0-7-1-11-3" />
    <path d="M15.5 9.5c.8.6 1.5 1.5 1.5 2.5s-.7 1.9-1.5 2.5" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" />
  </svg>
);

export const Compass = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const Calendar = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="m9.5 15 2 2 3.5-3.5" />
  </svg>
);

export const Store = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 8 5.5 3.5h13L20 8" />
    <path d="M4 8h16v2.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-6 0 2.5 2.5 0 0 1-5 0V8Z" />
    <path d="M5.5 13.5V20a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-6.5" />
    <path d="M9.5 20.5v-5h5v5" />
  </svg>
);

export const Studio = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 17v-4M9 17V9M14 17v-6M19 17V5" />
    <path d="M3 20.5h18" />
    <circle cx="19" cy="5" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const Pen = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m14.5 5 4.5 4.5L8 20.5l-5 1 1-5L14.5 5Z" />
    <path d="m12.5 7 4.5 4.5" />
  </svg>
);

export const Heart = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg {...base(className)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5S3.5 15.5 3.5 9.2C3.5 6.3 5.7 4 8.5 4c1.6 0 3 .8 3.5 2 .5-1.2 1.9-2 3.5-2 2.8 0 5 2.3 5 5.2 0 6.3-8.5 11.3-8.5 11.3Z" />
  </svg>
);

export const Bulb = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg {...base(className)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.7.5 1 1.3 1 2.1h5c0-.8.3-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    <path d="M9.5 19h5M10.5 21.5h3" />
  </svg>
);

export const Chat = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20.5 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.2 0-2.4-.3-3.4-.8L4 19.5l1.3-5A7.5 7.5 0 1 1 20.5 11.5Z" />
    <path d="M9 10h6M9 13.5h4" />
  </svg>
);

export const Share = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M13 5.5 21 12l-8 6.5V14c-5 0-8 1.5-9.5 4.5 0-5 2.5-9.5 9.5-10.5v-2.5Z" />
  </svg>
);

export const Bookmark = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg {...base(className)} fill={filled ? "currentColor" : "none"}>
    <path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-3.5L6 20V4.5a.5.5 0 0 1 .5-.5Z" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 4.5 4.5" />
  </svg>
);

export const Bell = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5c0 5-2 6-2 6h15s-2-1-2-6A5.5 5.5 0 0 0 12 3.5Z" />
    <path d="M10 18.5a2 2 0 0 0 4 0" />
  </svg>
);

export const Check = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const BadgeCheck = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5 14.4 5l3.4-.4.6 3.4 3 1.8-1.5 3.2 1.5 3.2-3 1.8-.6 3.4-3.4-.4L12 23.5 9.6 21l-3.4.4-.6-3.4-3-1.8L4.1 13 2.6 9.8l3-1.8.6-3.4L9.6 5 12 2.5Z" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" fill="none" stroke="#f1f0e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MaskIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 5.5C6.5 4.5 9.5 4 12 4s5.5.5 8 1.5V12c0 5-3.5 8-8 8.5C7.5 20 4 17 4 12V5.5Z" />
    <path d="M8 10.5c.8-.6 2-.6 2.8 0M13.2 10.5c.8-.6 2-.6 2.8 0" />
    <path d="M9 15c1.8 1.4 4.2 1.4 6 0" />
  </svg>
);

export const Flame = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3s1 2.6 1 4.5c0 1.4-.6 2.4-.6 2.4S15 9 16.8 11.3c1.3 1.7 1.7 3 1.7 4.2A6.5 6.5 0 0 1 12 22a6.5 6.5 0 0 1-6.5-6.5c0-2.7 1.6-4.5 2.7-6C9.5 8 12 3 12 3Z" />
    <path d="M12 22c-1.8-1-2.8-2.6-2.8-4.3 0-2 2.8-3.7 2.8-3.7s2.8 1.7 2.8 3.7c0 1.7-1 3.3-2.8 4.3Z" />
  </svg>
);

export const Spark = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z" />
    <path d="M18.5 14.5c.3 1.8 1 2.6 3 3-2 .4-2.7 1.2-3 3-.3-1.8-1-2.6-3-3 2-.4 2.7-1.2 3-3Z" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const ArrowLeft = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const MapPin = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </svg>
);

export const Clock = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Users = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3.5 20c.5-3.5 2.5-5.5 5.5-5.5s5 2 5.5 5.5" />
    <path d="M15.5 5.5a3.5 3.5 0 0 1 0 6.4M17 14.7c2 .6 3.2 2.3 3.5 4.8" />
  </svg>
);

export const Star = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg {...base(className)} fill={filled ? "currentColor" : "none"}>
    <path d="m12 4 2.3 4.8 5.2.7-3.8 3.7.9 5.3L12 16l-4.6 2.5.9-5.3-3.8-3.7 5.2-.7L12 4Z" />
  </svg>
);

export const Trophy = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5.5H4v1.5a3 3 0 0 0 3 3M17 5.5h3V7a3 3 0 0 1-3 3" />
    <path d="M12 14v3.5M8.5 20.5h7M10 17.5h4v3h-4v-3Z" />
  </svg>
);

export const Send = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-7-2.5 17.5-8Z" />
  </svg>
);

export const Flag = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5 21V4.5" />
    <path d="M5 4.5c2.5-1.5 5-1.5 7 0s4.5 1.5 7 0V14c-2.5 1.5-5 1.5-7 0s-4.5-1.5-7 0" />
  </svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5l1 13h9l1-13" />
    <path d="M10 10.5v5.5M14 10.5v5.5" />
  </svg>
);

export const GradCap = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m12 4.5 10 4.5-10 4.5L2 9l10-4.5Z" />
    <path d="M6.5 11.2v4.3c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.3" />
    <path d="M22 9v5" />
  </svg>
);

export const WaveHand = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M7.5 11.5 5 9a1.7 1.7 0 0 1 2.4-2.4l2.6 2.6V4.5a1.6 1.6 0 0 1 3.2 0V9m0-2a1.6 1.6 0 0 1 3.2 0v3.5m0-1.5a1.5 1.5 0 0 1 3 0v5c0 4-2.5 7-6.5 7-3 0-4.5-1.5-6-4L4.5 14a1.8 1.8 0 0 1 3-2l1 1" />
  </svg>
);

export const Mail = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
);

export const Lock = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <path d="M12 14.5v2" />
  </svg>
);

export const LogOut = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M9.5 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3.5" />
    <path d="M15 8l4 4-4 4M19 12H9.5" />
  </svg>
);
