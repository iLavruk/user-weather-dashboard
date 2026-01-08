import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import HandleStateBlock from "../components/state-block";
import HandleWeatherIcon from "../components/weather-icon";
import { useUsers } from "../hooks/use-users";
import {
  EMPTY_LIST_LENGTH,
  FORECAST_DAYS_COUNT,
  UNAVAILABLE_MESSAGE,
  UNKNOWN_ERROR_MESSAGE
} from "../lib/constants";
import { resolveWeather } from "../lib/weather-codes";
import { formatDate, formatTemp } from "../lib/format";
import { AsyncStatus } from "../store/async-status";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadForecast } from "../store/weather-slice";

const FORECAST_ICON_SIZE = 28;
const FORECAST_TITLE = `${FORECAST_DAYS_COUNT}-day forecast`;

export default function HandleUserDetailPage() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();

  const {
    items,
    status: usersStatus,
    error: usersError,
    onReload
  } = useUsers();
  const user = userId ? items.find((item) => item.id === userId) : undefined;
  const isUserLoading =
    usersStatus === AsyncStatus.IDLE || usersStatus === AsyncStatus.LOADING;

  const forecastDays = useAppSelector((state) => state.weather.forecastDays);
  const forecastStatus = useAppSelector((state) => state.weather.forecastStatus);
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const forecastUserId = useAppSelector(
    (state) => state.weather.forecastUserId
  );
  const isForecastForUser = userId ? forecastUserId === userId : false;

  const dispatchForecast = useCallback(() => {
    if (!user) {
      return;
    }

    dispatch(
      loadForecast({
        userId: user.id,
        latitude: user.latitude,
        longitude: user.longitude
      })
    );
  }, [dispatch, user]);

  useEffect(() => {
    if (user && (!isForecastForUser || forecastStatus === AsyncStatus.IDLE)) {
      dispatchForecast();
    }
  }, [dispatchForecast, forecastStatus, isForecastForUser, user]);

  const onReloadForecast = useCallback(() => {
    dispatchForecast();
  }, [dispatchForecast]);

  if (!userId) {
    return <HandleStateBlock>User not found.</HandleStateBlock>;
  }

  if (isUserLoading && !user) {
    return <HandleStateBlock>Loading user...</HandleStateBlock>;
  }

  if (usersStatus === AsyncStatus.FAILED) {
    return (
      <HandleStateBlock tone="error">
        <p>Failed to load user: {usersError ?? UNKNOWN_ERROR_MESSAGE}</p>
        <button className="button primary" onClick={onReload}>
          Retry
        </button>
      </HandleStateBlock>
    );
  }

  if (!user) {
    return <HandleStateBlock>User not found.</HandleStateBlock>;
  }

  const isForecastDaysLoading =
    isForecastForUser && forecastStatus === AsyncStatus.LOADING;

  const forecastCards: JSX.Element[] = [];
  if (isForecastForUser && forecastDays.length > EMPTY_LIST_LENGTH) {
    for (const day of forecastDays) {
      const visual = resolveWeather(day.weatherCode);
      forecastCards.push(
        <div className="forecast-card" key={day.date}>
          <div className="forecast-date">{formatDate(day.date)}</div>
          <HandleWeatherIcon
            icon={visual.icon}
            label={visual.label}
            size={FORECAST_ICON_SIZE}
          />
          <div className="forecast-temp">
            <span>High {formatTemp(day.maxTemp)}</span>
            <span>Low {formatTemp(day.minTemp)}</span>
          </div>
          <div className="forecast-label">{visual.label}</div>
        </div>
      );
    }
  }
  const hasForecastCards = forecastCards.length > EMPTY_LIST_LENGTH;

  return (
    <section className="detail">
      <div className="detail__toolbar">
        <Link className="button ghost" to="/">
          Back to list
        </Link>
      </div>

      <div className="detail__card">
        <img
          src={user.avatarLarge}
          alt={`${user.fullName} portrait`}
          className="detail__avatar"
        />
        <div className="detail__info">
          <h2 className="detail__title">{user.fullName}</h2>
          <div className="detail__meta">
            <span className="chip">{user.gender}</span>
            <span className="muted">
              {user.city}, {user.country}
            </span>
          </div>
          <div className="muted">{user.email}</div>
        </div>
      </div>

      <div className="forecast">
        <div className="forecast__header">
          <h3 className="forecast__title">{FORECAST_TITLE}</h3>
        </div>

        {isForecastDaysLoading ? (
          <HandleStateBlock>Loading forecast...</HandleStateBlock>
        ) : null}
        {isForecastForUser && forecastStatus === AsyncStatus.FAILED ? (
          <HandleStateBlock tone="error">
            <p>Forecast error: {forecastError ?? UNAVAILABLE_MESSAGE}</p>
            <button className="button primary" onClick={onReloadForecast}>
              Retry
            </button>
          </HandleStateBlock>
        ) : null}
        {isForecastForUser &&
        forecastStatus === AsyncStatus.SUCCEEDED &&
        forecastDays.length === EMPTY_LIST_LENGTH ? (
          <HandleStateBlock>No forecast data available.</HandleStateBlock>
        ) : null}

        {hasForecastCards ? (
          <div className="forecast-grid">{forecastCards}</div>
        ) : null}
      </div>
    </section>
  );
}
