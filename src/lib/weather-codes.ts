export enum WeatherIcon {
  SUN = "sun",
  CLOUD_SUN = "cloud-sun",
  CLOUD = "cloud",
  FOG = "fog",
  DRIZZLE = "drizzle",
  RAIN = "rain",
  SNOW = "snow",
  STORM = "storm"
}

export type WeatherVisual = {
  icon: WeatherIcon;
  label: string;
};

const WEATHER_GROUPS: Array<{ codes: number[]; icon: WeatherIcon; label: string }> = [
  { codes: [0], icon: WeatherIcon.SUN, label: "Clear sky" },
  { codes: [1, 2], icon: WeatherIcon.CLOUD_SUN, label: "Mainly clear" },
  { codes: [3], icon: WeatherIcon.CLOUD, label: "Overcast" },
  { codes: [45, 48], icon: WeatherIcon.FOG, label: "Fog" },
  { codes: [51, 53, 55], icon: WeatherIcon.DRIZZLE, label: "Drizzle" },
  { codes: [56, 57], icon: WeatherIcon.DRIZZLE, label: "Freezing drizzle" },
  { codes: [61, 63, 65], icon: WeatherIcon.RAIN, label: "Rain" },
  { codes: [66, 67], icon: WeatherIcon.RAIN, label: "Freezing rain" },
  { codes: [71, 73, 75], icon: WeatherIcon.SNOW, label: "Snow fall" },
  { codes: [77], icon: WeatherIcon.SNOW, label: "Snow grains" },
  { codes: [80, 81, 82], icon: WeatherIcon.RAIN, label: "Rain showers" },
  { codes: [85, 86], icon: WeatherIcon.SNOW, label: "Snow showers" },
  { codes: [95], icon: WeatherIcon.STORM, label: "Thunderstorm" },
  { codes: [96, 99], icon: WeatherIcon.STORM, label: "Thunderstorm with hail" }
];

const FALLBACK_WEATHER: WeatherVisual = {
  icon: WeatherIcon.CLOUD,
  label: "Unknown"
};

export function resolveWeather(code: number | undefined): WeatherVisual {
  if (code === undefined || Number.isNaN(code)) {
    return FALLBACK_WEATHER;
  }

  for (const group of WEATHER_GROUPS) {
    if (group.codes.includes(code)) {
      return { icon: group.icon, label: group.label };
    }
  }

  return FALLBACK_WEATHER;
}
