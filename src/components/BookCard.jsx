import React, { useState, useEffect } from 'react';
import './BookCard.css';

function BookCard({ coverBlob, title, authors }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (coverBlob) {
      const url = URL.createObjectURL(coverBlob);
      setImageUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [coverBlob]);

  return (
    <div className="book-card">
      <div className="book-cover">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="no-cover">Нет обложки</div>
        )}
      </div>
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">
        {authors?.join(', ')}
      </p>
    </div>
  );
}

export default BookCard;