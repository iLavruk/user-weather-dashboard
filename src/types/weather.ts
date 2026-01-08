export type OpenMeteoDaily = {
  time: string[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  weathercode: number[];
};

export type OpenMeteoForecastResponse = {
  current_weather?: {
    temperature: number;
    weathercode: number;
  };
  daily?: OpenMeteoDaily;
};

export type WeatherSnapshot = {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  weatherCode: number;
};

export type ForecastDay = {
  date: string;
  minTemp: number;
  maxTemp: number;
  weatherCode: number;
};
