const DATE_LOCALE = "en-US";
const DATE_FORMAT = new Intl.DateTimeFormat(DATE_LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric"
});
const MISSING_TEMPERATURE = "--";
const TEMPERATURE_UNIT = "deg C";

export function formatTemp(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) {
    return MISSING_TEMPERATURE;
  }

  return `${Math.round(value)} ${TEMPERATURE_UNIT}`;
}

export function formatDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return DATE_FORMAT.format(parsed);
}
