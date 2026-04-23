import React from 'react';
import './WeatherCard.css';

function WeatherCard({ dayData }) {
  const date = new Date(dayData.dt * 1000);
  const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
  const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  
  const weather = dayData.weather[0];
  const temp = Math.round(dayData.main.temp);
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  
  return (
    <div className="weather-card">
      <div className="weather-card-date">
        <span className="day-name">{dayName}</span>
        <span className="day-month">{dayMonth}</span>
      </div>
      
      <div className="weather-card-icon">
        <img 
          src={iconUrl} 
          alt={weather.description}
          className="weather-icon"
          loading="lazy"
        />
      </div>
      
      <div className="weather-card-temp">
        <span className="temp-value">{temp}°</span>
      </div>
      
      <div className="weather-card-description">
        {weather.description}
      </div>
      
      <div className="weather-card-details">
        <span>💨 {Math.round(dayData.wind.speed)} м/с</span>
        <span>💧 {dayData.main.humidity}%</span>
      </div>
    </div>
  );
}

export default WeatherCard;