const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomTempByCity = (city, isMax = false) => {
  const cityTemps = {
    'москва': { min: 15, max: 28 },
    'moscow': { min: 15, max: 28 },
    'лондон': { min: 12, max: 22 },
    'london': { min: 12, max: 22 },
    'нью-йорк': { min: 18, max: 30 },
    'new york': { min: 18, max: 30 },
    'берлин': { min: 14, max: 25 },
    'berlin': { min: 14, max: 25 },
    'париж': { min: 15, max: 26 },
    'paris': { min: 15, max: 26 },
    'токио': { min: 20, max: 32 },
    'tokyo': { min: 20, max: 32 },
  };
  
  const cityLower = city.toLowerCase();
  let tempRange = cityTemps[cityLower];
  
  if (!tempRange) {
    tempRange = { min: 10, max: 25 };
  }
  
  if (isMax) {
    return randomInRange(tempRange.min + 5, tempRange.max);
  }
  return randomInRange(tempRange.min, tempRange.max - 5);
};

const getRandomWeather = () => {
  const weatherTypes = [
    { main: 'Clear', description: 'ясно', icon: '01d' },
    { main: 'Clear', description: 'ясно', icon: '01n' },
    { main: 'Clouds', description: 'малооблачно', icon: '02d' },
    { main: 'Clouds', description: 'малооблачно', icon: '02n' },
    { main: 'Clouds', description: 'облачно', icon: '03d' },
    { main: 'Clouds', description: 'облачно', icon: '03n' },
    { main: 'Clouds', description: 'пасмурно', icon: '04d' },
    { main: 'Clouds', description: 'пасмурно', icon: '04n' },
    { main: 'Rain', description: 'небольшой дождь', icon: '10d' },
    { main: 'Rain', description: 'небольшой дождь', icon: '10n' },
    { main: 'Rain', description: 'дождь', icon: '09d' },
    { main: 'Rain', description: 'дождь', icon: '09n' },
  ];
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
};

export const generateMockWeatherData = (cityName) => {
  const now = Date.now();
  const baseTemp = getRandomTempByCity(cityName);
  const baseTempMax = getRandomTempByCity(cityName, true);
  const baseTempMin = baseTemp - randomInRange(3, 8);
  
  const hourlyList = [];
  for (let i = 0; i < 6; i++) {
    const weather = getRandomWeather();
    const tempVariation = randomInRange(-3, 3);
    hourlyList.push({
      dt: (now + (i + 1) * 3600000) / 1000,
      main: {
        temp: baseTemp + tempVariation,
        feels_like: baseTemp + tempVariation - randomInRange(0, 2),
        humidity: randomInRange(60, 90),
        pressure: randomInRange(1005, 1015),
        temp_max: baseTemp + tempVariation + randomInRange(1, 3),
        temp_min: baseTemp + tempVariation - randomInRange(2, 5)
      },
      weather: [weather],
      wind: { speed: randomInRange(2, 8) }
    });
  }

  const dailyList = [];
  for (let i = 0; i < 6; i++) {
    const weather = getRandomWeather();
    const dayTempMax = baseTempMax + randomInRange(-5, 5);
    const dayTempMin = baseTempMin + randomInRange(-3, 3);
    
    dailyList.push({
      dt: (now + (i + 1) * 86400000) / 1000,
      main: {
        temp: (dayTempMax + dayTempMin) / 2,
        temp_max: dayTempMax,
        temp_min: dayTempMin,
        humidity: randomInRange(55, 85),
        pressure: randomInRange(1005, 1015)
      },
      weather: [weather],
      wind: { speed: randomInRange(3, 10) }
    });
  }
  
  const currentWeather = getRandomWeather();
  
  return {
    city: { 
      name: cityName.charAt(0).toUpperCase() + cityName.slice(1), 
      country: randomInRange(1, 200) > 100 ? 'RU' : 'US',
      coord: {
        lat: 55.7558,
        lon: 37.6173
      }
    },
    list: [
      {
        dt: now / 1000,
        main: {
          temp: baseTemp,
          feels_like: baseTemp - randomInRange(0, 2),
          humidity: randomInRange(55, 85),
          pressure: randomInRange(1005, 1015),
          temp_max: baseTempMax,
          temp_min: baseTempMin
        },
        weather: [currentWeather],
        wind: { speed: randomInRange(2, 7) }
      },
      ...hourlyList,
      ...dailyList
    ]
  };
};

export const mockWeatherData = generateMockWeatherData('Москва');