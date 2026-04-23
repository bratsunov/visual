import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Введите город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Найти'}
      </button>
    </form>
  );
}

export default SearchBar;