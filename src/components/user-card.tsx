import { Link } from "react-router-dom";
import { UNAVAILABLE_MESSAGE } from "../lib/constants";
import { resolveWeather } from "../lib/weather-codes";
import { formatTemp } from "../lib/format";
import { AsyncStatus } from "../store/async-status";
import { useAppSelector } from "../store/hooks";
import type { User } from "../types/user";
import HandleWeatherIcon from "./weather-icon";

type Props = {
  user: User;
};

const WEATHER_ICON_SIZE = 32;

export default function HandleUserCard({ user }: Props) {
  const snapshot = useAppSelector(
    (state) => state.weather.snapshotByUserId[user.id]
  );
  const snapshotsStatus = useAppSelector(
    (state) => state.weather.snapshotsStatus
  );
  const snapshotsError = useAppSelector(
    (state) => state.weather.snapshotsError
  );

  const visual = resolveWeather(snapshot?.weatherCode);

  return (
    <Link to={`/users/${user.id}`} className="user-card">
      <div className="user-card__header">
        <img
          src={user.avatarSmall}
          alt={`${user.fullName} portrait`}
          className="user-card__avatar"
        />
        <div className="user-card__meta">
          <div className="user-card__name">
            <h3 className="user-card__title">{user.fullName}</h3>
            <span className="chip">{user.gender}</span>
          </div>
          <p className="muted">
            {user.city}, {user.country}
          </p>
          <p className="muted user-card__email">{user.email}</p>
        </div>
      </div>
      <div className="user-card__weather">
        <div className="user-card__weather-main">
          <HandleWeatherIcon
            icon={visual.icon}
            label={visual.label}
            size={WEATHER_ICON_SIZE}
          />
          <div>
            <div className="weather-temp">
              {formatTemp(snapshot?.currentTemp)}
            </div>
            <div className="weather-label">{visual.label}</div>
          </div>
        </div>
        <div className="user-card__weather-range">
          <span>Low {formatTemp(snapshot?.minTemp)}</span>
          <span>High {formatTemp(snapshot?.maxTemp)}</span>
        </div>
        {snapshotsStatus === AsyncStatus.LOADING ? (
          <div className="subtle">Loading weather...</div>
        ) : null}
        {snapshotsStatus === AsyncStatus.FAILED ? (
          <div className="error-text">
            Weather error: {snapshotsError ?? UNAVAILABLE_MESSAGE}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
