import React from 'react';
import './HourlyForecast.css';

function HourlyForecast({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return (
      <div className="hourly-forecast">
        <h3 className="section-title">Hourly Forecast</h3>
        <div className="hourly-list">Нет данных</div>
      </div>
    );
  }

  return (
    <div className="hourly-forecast">
      <h3 className="section-title">Hourly Forecast</h3>
      <div className="hourly-list">
        {hourly.map((hour, idx) => {
          const time = new Date(hour.dt * 1000);
          const hourStr = time.getHours().toString().padStart(2, '0') + ':00';
          const temp = Math.round(hour.main.temp);
          const iconCode = hour.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
          
          return (
            <div key={idx} className="hourly-item">
              <div className="hourly-time">{hourStr}</div>
              <img src={iconUrl} alt="" className="hourly-icon" />
              <div className="hourly-temp">{temp}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;