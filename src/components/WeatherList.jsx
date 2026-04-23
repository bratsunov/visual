import React from 'react';
import WeatherCard from './WeatherCard';
import './WeatherList.css';

function WeatherList({ weatherData }) {
  if (!weatherData || !weatherData.list) {
    return <div className="weather-list-empty">Нет данных</div>;
  }

  return (
    <div className="weather-list">
      <div className="weather-list-header">
        <h2>{weatherData.city.name}, {weatherData.city.country}</h2>
        <p>Прогноз на {weatherData.list.length} дней</p>
      </div>
      <div className="weather-list-cards">
        {weatherData.list.map((day, index) => (
          <WeatherCard key={index} dayData={day} />
        ))}
      </div>
    </div>
  );
}

export default WeatherList;