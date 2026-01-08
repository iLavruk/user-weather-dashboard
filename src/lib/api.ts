import type { RandomUserApiResponse, RandomUserApiUser, User } from "../types/user";
import type {
  ForecastDay,
  OpenMeteoForecastResponse,
  WeatherSnapshot
} from "../types/weather";
import { FORECAST_DAYS_COUNT } from "./constants";

const USER_API_URL = "https://randomuser.me/api/";
const USER_RESULTS_COUNT = 10;
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const WEATHER_DAILY_FIELDS = "temperature_2m_max,temperature_2m_min,weathercode";
const CURRENT_WEATHER_VALUE = "true";
const SNAPSHOT_DAYS_COUNT = 1;
const WEATHER_TIMEZONE = "auto";
const FIRST_INDEX = 0;
const USER_API_ERROR_PREFIX = "User API error";
const WEATHER_API_ERROR_PREFIX = "Weather API error";
const WEATHER_DATA_MISSING_MESSAGE = "Weather data missing";
const FORECAST_DATA_MISSING_MESSAGE = "Forecast data missing";
const LATITUDE_LABEL = "latitude";
const LONGITUDE_LABEL = "longitude";

function parseCoordinate(value: string, label: string): number {
  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${label} coordinate`);
  }

  return parsed;
}

function mapUser(apiUser: RandomUserApiUser): User {
  return {
    id: apiUser.login.uuid,
    fullName: `${apiUser.name.first} ${apiUser.name.last}`,
    gender: apiUser.gender,
    email: apiUser.email,
    city: apiUser.location.city,
    country: apiUser.location.country,
    latitude: parseCoordinate(apiUser.location.coordinates.latitude, LATITUDE_LABEL),
    longitude: parseCoordinate(
      apiUser.location.coordinates.longitude,
      LONGITUDE_LABEL
    ),
    avatarLarge: apiUser.picture.large,
    avatarSmall: apiUser.picture.thumbnail
  };
}

export async function fetchUsers(): Promise<User[]> {
  const params = new URLSearchParams({
    results: String(USER_RESULTS_COUNT)
  });
  const response = await fetch(`${USER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`${USER_API_ERROR_PREFIX}: ${response.status}`);
  }

  const data = (await response.json()) as RandomUserApiResponse;
  const users: User[] = [];

  for (const apiUser of data.results) {
    users.push(mapUser(apiUser));
  }

  return users;
}

export async function fetchWeatherSnapshot(
  latitude: number,
  longitude: number
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: CURRENT_WEATHER_VALUE,
    daily: WEATHER_DAILY_FIELDS,
    forecast_days: String(SNAPSHOT_DAYS_COUNT),
    timezone: WEATHER_TIMEZONE
  });

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`${WEATHER_API_ERROR_PREFIX}: ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;

  if (!data.current_weather || !data.daily) {
    throw new Error(WEATHER_DATA_MISSING_MESSAGE);
  }

  const minTemp = data.daily.temperature_2m_min[FIRST_INDEX];
  const maxTemp = data.daily.temperature_2m_max[FIRST_INDEX];
  const dayCode = data.daily.weathercode[FIRST_INDEX];

  if (minTemp === undefined || maxTemp === undefined) {
    throw new Error(WEATHER_DATA_MISSING_MESSAGE);
  }

  return {
    currentTemp: data.current_weather.temperature,
    minTemp,
    maxTemp,
    weatherCode: dayCode ?? data.current_weather.weathercode
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<ForecastDay[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: WEATHER_DAILY_FIELDS,
    forecast_days: String(FORECAST_DAYS_COUNT),
    timezone: WEATHER_TIMEZONE
  });

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`${WEATHER_API_ERROR_PREFIX}: ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;

  if (!data.daily) {
    throw new Error(FORECAST_DATA_MISSING_MESSAGE);
  }

  const timeValues = data.daily.time;
  const minTemps = data.daily.temperature_2m_min;
  const maxTemps = data.daily.temperature_2m_max;
  const weatherCodes = data.daily.weathercode;
  const forecastDays: ForecastDay[] = [];

  for (const [index, date] of timeValues.entries()) {
    const minTemp = minTemps[index];
    const maxTemp = maxTemps[index];
    const code = weatherCodes[index];

    if (minTemp === undefined || maxTemp === undefined || code === undefined) {
      continue;
    }

    forecastDays.push({
      date,
      minTemp,
      maxTemp,
      weatherCode: code
    });
  }

  return forecastDays;
}
