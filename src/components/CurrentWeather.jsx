import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrentWeather.css';

const API_KEY = '96c36d2dc62a574e09fa64ba2a515132';
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

function CurrentWeather({ city, country, current, lat, lon, useMock }) {
  const [airQuality, setAirQuality] = useState(null);
  const [loadingAir, setLoadingAir] = useState(false);

  const temp = Math.round(current.main.temp);
  const humidity = current.main.humidity;
  const wind = Math.round(current.wind.speed);
  const pressure = Math.round(current.main.pressure * 0.750064);
  const weatherDesc = current.weather[0].description;
  const iconCode = current.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  useEffect(() => {
    if (!useMock && lat && lon) {
      fetchAirQuality(lat, lon);
    } else if (useMock) {
      const mockAqiValues = [
        { aqi: 1, name: 'Good' },
        { aqi: 2, name: 'Fair' },
        { aqi: 3, name: 'Moderate' },
        { aqi: 4, name: 'Poor' },
        { aqi: 5, name: 'Very Poor' }
      ];
      const randomAqi = mockAqiValues[Math.floor(Math.random() * mockAqiValues.length)];
      setAirQuality({ main: { aqi: randomAqi.aqi } });
      setLoadingAir(false);
    }
  }, [lat, lon, useMock]);

  const fetchAirQuality = async (latitude, longitude) => {
    setLoadingAir(true);
    try {
      const response = await axios.get(AIR_POLLUTION_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY
        }
      });
      
      if (response.data && response.data.list && response.data.list[0]) {
        setAirQuality(response.data.list[0]);
      }
    } catch (err) {
      console.error('Ошибка загрузки качества воздуха:', err);
    } finally {
      setLoadingAir(false);
    }
  };

  const getAQIText = (aqi) => {
    const texts = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    };
    return texts[aqi] || 'Нет данных';
  };

  return (
    <div className="current-weather">
      <div className="current-city">{city}, {country}</div>
      
      <div className="current-main">
        <div className="current-temp">
          <span className="temp-value">{temp}°</span>
          <span className="temp-unit">C</span>
        </div>
        <div className="current-icon">
          <img src={iconUrl} alt={weatherDesc} />
        </div>
      </div>
      
      <div className="current-details">
        <div className="detail-item">
          <span className="detail-label">HUMIDITY</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">WIND</span>
          <span className="detail-value">{wind} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">AIR PRESSURE</span>
          <span className="detail-value">{pressure} mm</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">UV</span>
          <span className="detail-value">3</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">AIR QUALITY</span>
          <span className="detail-value">
            {loadingAir ? '...' : (airQuality ? getAQIText(airQuality.main.aqi) : 'Нет данных')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;