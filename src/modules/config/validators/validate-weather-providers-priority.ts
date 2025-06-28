import { WeatherProviderEnum } from '@weather/enums/weather.provider.enum';

export const validateWeatherProvidersPriority = (value: string): string => {
  const allowedValues = Object.values(WeatherProviderEnum);
  const items = value.split(',').map((item) => item.trim());

  const invalid = items.filter((item: WeatherProviderEnum) => !allowedValues.includes(item));
  if (invalid.length > 0) {
    throw new Error(`Invalid weather providers: ${invalid.join(', ')}`);
  }

  return value;
};
