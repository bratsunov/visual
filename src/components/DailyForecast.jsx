import React from 'react';
import './DailyForecast.css';

function DailyForecast({ daily }) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (!daily || daily.length === 0) return null;

  return (
    <div className="daily-forecast">
      <h3 className="section-title">Daily Forecast</h3>
      <div className="daily-list">
        {daily.map((day, idx) => {
          const date = new Date(day.dt * 1000);
          const dayName = weekdays[date.getDay()];
          const dayNum = date.getDate();
          const tempMax = Math.round(day.main.temp_max);
          const tempMin = Math.round(day.main.temp_min);
          const iconCode = day.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
          
          return (
            <div key={idx} className="daily-item">
              <div className="daily-day">{dayName}, {dayNum}</div>
              <div className="daily-temp-range">
                <span className="daily-temp-max">{tempMax}°</span>
                <span className="daily-temp-min">{tempMin}°</span>
              </div>
              <img src={iconUrl} alt="" className="daily-icon" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;