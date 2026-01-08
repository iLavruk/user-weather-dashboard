import { WeatherIcon } from "../lib/weather-codes";

type Props = {
  icon: WeatherIcon;
  label?: string;
  size?: number;
  className?: string;
};

const DEFAULT_ICON_SIZE = 32;
const VIEWBOX_SIZE = 64;
const VIEWBOX_VALUE = `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`;

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none"
} as const;

const CLOUD_PATH =
  "M20 46h28a12 12 0 0 0 0-24 16 16 0 0 0-31-3 10 10 0 0 0 3 27z";

export default function HandleWeatherIcon({
  icon,
  label,
  size = DEFAULT_ICON_SIZE,
  className
}: Props) {
  const title = label ?? icon;
  const classes = ["weather-icon", `weather-icon--${icon}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      viewBox={VIEWBOX_VALUE}
      width={size}
      height={size}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <title>{title}</title>
      {renderIcon(icon)}
    </svg>
  );
}

function renderIcon(icon: WeatherIcon): JSX.Element {
  switch (icon) {
    case WeatherIcon.SUN:
      return (
        <g {...STROKE}>
          <circle cx="32" cy="32" r="10" />
          <line x1="32" y1="6" x2="32" y2="16" />
          <line x1="32" y1="48" x2="32" y2="58" />
          <line x1="6" y1="32" x2="16" y2="32" />
          <line x1="48" y1="32" x2="58" y2="32" />
          <line x1="12" y1="12" x2="19" y2="19" />
          <line x1="45" y1="45" x2="52" y2="52" />
          <line x1="12" y1="52" x2="19" y2="45" />
          <line x1="45" y1="19" x2="52" y2="12" />
        </g>
      );
    case WeatherIcon.CLOUD_SUN:
      return (
        <g>
          <g {...STROKE}>
            <circle cx="20" cy="20" r="7" />
            <line x1="20" y1="6" x2="20" y2="12" />
            <line x1="20" y1="28" x2="20" y2="34" />
            <line x1="6" y1="20" x2="12" y2="20" />
            <line x1="28" y1="20" x2="34" y2="20" />
            <line x1="10" y1="10" x2="14" y2="14" />
            <line x1="26" y1="26" x2="30" y2="30" />
            <line x1="10" y1="30" x2="14" y2="26" />
            <line x1="26" y1="14" x2="30" y2="10" />
          </g>
          <path {...STROKE} d={CLOUD_PATH} />
        </g>
      );
    case WeatherIcon.CLOUD:
      return <path {...STROKE} d={CLOUD_PATH} />;
    case WeatherIcon.FOG:
      return (
        <g {...STROKE}>
          <path d={CLOUD_PATH} />
          <line x1="16" y1="52" x2="48" y2="52" />
          <line x1="20" y1="58" x2="52" y2="58" />
        </g>
      );
    case WeatherIcon.DRIZZLE:
      return (
        <g {...STROKE}>
          <path d={CLOUD_PATH} />
          <line x1="24" y1="50" x2="24" y2="56" />
          <line x1="34" y1="50" x2="34" y2="56" />
          <line x1="44" y1="50" x2="44" y2="56" />
        </g>
      );
    case WeatherIcon.RAIN:
      return (
        <g {...STROKE}>
          <path d={CLOUD_PATH} />
          <line x1="24" y1="50" x2="24" y2="60" />
          <line x1="34" y1="50" x2="34" y2="62" />
          <line x1="44" y1="50" x2="44" y2="60" />
        </g>
      );
    case WeatherIcon.SNOW:
      return (
        <g {...STROKE}>
          <path d={CLOUD_PATH} />
          <line x1="24" y1="52" x2="30" y2="58" />
          <line x1="30" y1="52" x2="24" y2="58" />
          <line x1="38" y1="52" x2="44" y2="58" />
          <line x1="44" y1="52" x2="38" y2="58" />
        </g>
      );
    case WeatherIcon.STORM:
      return (
        <g>
          <path {...STROKE} d={CLOUD_PATH} />
          <path
            d="M34 40 L26 54 H34 L28 64 L46 48 H38 L42 40 Z"
            fill="currentColor"
          />
        </g>
      );
    default:
      return <path {...STROKE} d={CLOUD_PATH} />;
  }
}
