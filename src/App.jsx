import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './components/BookCard';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookCover = async (isbn) => {
  try {
    const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    const imageResponse = await fetch(imageUrl);
    
    if (imageResponse.ok && imageResponse.status !== 404) {
      const blob = await imageResponse.blob();

      if (blob.size > 1000) {
        return blob;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        const booksResponse = await axios.get(
          'https://fakeapi.extendsclass.com/books'
        );
        const booksData = booksResponse.data;
        
        const booksWithCovers = await Promise.all(
          booksData.map(async (book) => {
            let coverBlob = null;
            
            if (book.isbn) {
              coverBlob = await fetchBookCover(book.isbn);
            }
            
            return {
              ...book,
              coverBlob: coverBlob
            };
          })
        );
        
        setBooks(booksWithCovers);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки книг:', err);
        setError('Не удалось загрузить книги. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Загрузка книг...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            coverBlob={book.coverBlob}
            title={book.title}
            authors={book.authors}
          />
        ))}
      </div>
    </div>
  );
}

export default App;