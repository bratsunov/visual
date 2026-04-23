const dayColors = {
  Clear: '#4d71f2',
  Clouds: '#5a6e8a',
  Rain: '#3a5fd0',
  Drizzle: '#3a5fd0',
  Thunderstorm: '#2d3a4f',
  Snow: '#6a8af0',
  Mist: '#6e7b8c',
  Haze: '#6e7b8c',
  Fog: '#6e7b8c',
  Smoke: '#6e7b8c',
  Dust: '#8a7e6e',
  default: '#4d71f2'
};

const nightColors = {
  Clear: '#010d38',
  Clouds: '#1a2235',
  Rain: '#080e30',
  Drizzle: '#080e30',
  Thunderstorm: '#0d111a',
  Snow: '#152050',
  Mist: '#1e2433',
  Haze: '#1e2433',
  Fog: '#1e2433',
  Smoke: '#1e2433',
  Dust: '#2a2418',
  default: '#010d38'
};

export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getMainBackground = (weatherMain, isDay = true) => {
  if (isDay) {
    return dayColors[weatherMain] || dayColors.default;
  } else {
    return nightColors[weatherMain] || nightColors.default;
  }
};

export const getBackgroundColor = (weatherMain) => {
  return getMainBackground(weatherMain, true);
};