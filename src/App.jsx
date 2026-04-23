import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { getMainBackground } from './utils/weatherIcons';
import { generateMockWeatherData } from './mocks/mockWeather';
import './App.css';

const API_KEY = '96c36d2dc62a574e09fa64ba2a515132';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMock, setUseMock] = useState(true);
  const [coordinates, setCoordinates] = useState(null);

  const processForecastData = (data) => {
    const city = data.city.name;
    const country = data.city.country;
    const current = data.list[0];
    const hourly = data.list.slice(1, 7);
    
    const daysMap = new Map();
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!daysMap.has(date)) {
        daysMap.set(date, item);
      }
    });
    const daily = Array.from(daysMap.values()).slice(1, 7);
    
    return { city, country, current, hourly, daily };
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    if (useMock) {
      setTimeout(() => {
        const mockData = generateMockWeatherData(city);
        const processed = processForecastData(mockData);
        setWeatherData(processed);
        setCoordinates({ lat: 55.7558, lon: 37.6173 });
        setLoading(false);
      }, 500);
      return;
    }
    
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'ru'
        }
      });
      const processed = processForecastData(response.data);
      setWeatherData(processed);
      
      if (response.data.city && response.data.city.coord) {
        setCoordinates({
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon
        });
      }
    } catch (err) {
      console.error('Ошибка:', err);
      if (err.response?.status === 404) {
        setError('Город не найден. Проверьте название.');
      } else if (err.response?.status === 401) {
        setError('Ошибка API ключа. Проверьте ключ OpenWeatherMap.');
      } else {
        setError('Ошибка загрузки данных. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const isDayTime = () => {
    if (!weatherData || !weatherData.current) return true;
    const iconCode = weatherData.current.weather[0].icon;
    return iconCode.endsWith('d');
  };
  
  const isDay = isDayTime();
  const weatherMain = weatherData?.current?.weather[0]?.main || 'Clear';
  const mainBg = getMainBackground(weatherMain, isDay);
  
  const getFormattedDate = () => {
    const dateStr = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric' });
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };
  
  return (
    <div className="app" style={{ background: mainBg }}>
      <div className="app-container">
        {weatherData && (
          <h1 className="app-title date-title">{getFormattedDate()}</h1>
        )}
        {!weatherData && (
          <h1 className="app-title weather-title">Weather</h1>
        )}
        
        <div className="mock-toggle">
          <label>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
            />
            Использовать моки (для тестирования)
          </label>
        </div>
        
        <SearchBar onSearch={fetchWeather} isLoading={loading} />
        
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            <p>Загрузка прогноза...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        
        {!loading && weatherData && (
          <>
            <CurrentWeather 
              city={weatherData.city} 
              country={weatherData.country}
              current={weatherData.current}
              lat={coordinates?.lat}
              lon={coordinates?.lon}
              useMock={useMock}
            />
            <HourlyForecast hourly={weatherData.hourly} />
            <DailyForecast daily={weatherData.daily} />
          </>
        )}
        
        {!loading && !weatherData && !error && (
          <div className="welcome">
            <p>Введите название города, чтобы узнать прогноз погоды</p>
            <div className="example-cities">
              <span onClick={() => fetchWeather('Москва')}>Москва</span>
              <span onClick={() => fetchWeather('London')}>London</span>
              <span onClick={() => fetchWeather('New York')}>New York</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;