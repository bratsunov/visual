import { describe, it, expect } from 'vitest';
import { 
  createUser, 
  createBook, 
  calculateArea, 
  getStatusColor,
  firstCapital,
  trimAndUppercase,
  getFirstElement,
  findById
} from './lab1';

describe('createUser', () => {
  it('должен создавать пользователя с обязательными полями', () => {
    const user = createUser(1, 'Андрей Рублев');
    
    expect(user).toEqual({
      id: 1,
      name: 'Андрей Рублев',
      isActive: true
    });
    expect(user.email).toBeUndefined();
  });

  it('должен создавать пользователя с email', () => {
    const user = createUser(2, 'Андрей', 'andrey@mail.com');
    
    expect(user).toEqual({
      id: 2,
      name: 'Андрей',
      email: 'andrey@mail.com',
      isActive: true
    });
  });

  it('должен создавать неактивного пользователя', () => {
    const user = createUser(3, 'Андрей', undefined, false);
    
    expect(user).toEqual({
      id: 3,
      name: 'Андрей',
      isActive: false
    });
  });
});

describe('createBook', () => {
  it('должен создавать книгу с годом', () => {
    const book = createBook({
      title: 'Война и мир',
      author: 'Лев Толстой',
      year: 1869,
      genre: 'non-fiction'
    });
    
    expect(book).toEqual({
      title: 'Война и мир',
      author: 'Лев Толстой',
      year: 1869,
      genre: 'non-fiction'
    });
  });

  it('должен создавать книгу без года', () => {
    const book = createBook({
      title: 'Террор',
      author: 'Дэн Симмон',
      genre: 'fiction'
    });
    
    expect(book).toEqual({
      title: 'Террор',
      author: 'Дэн Симмон',
      genre: 'fiction'
    });
    expect(book.year).toBeUndefined();
  });
});

describe('calculateArea', () => {
  it('должен вычислять площадь круга', () => {
    expect(calculateArea('circle', 5)).toBeCloseTo(78.5398, 2);
    expect(calculateArea('circle', 0)).toBe(0);
    expect(calculateArea('circle', 2.5)).toBeCloseTo(19.635, 2);
  });

  it('должен вычислять площадь квадрата', () => {
    expect(calculateArea('square', 4)).toBe(16);
    expect(calculateArea('square', 0)).toBe(0);
    expect(calculateArea('square', 2.5)).toBe(6.25);
  });
});

describe('getStatusColor', () => {
  it('должен возвращать правильные цвета для статусов', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('red');
    expect(getStatusColor('new')).toBe('blue');
  });
});

describe('StringFormatter functions', () => {
  describe('firstCapital', () => {
    it('должен делать первую букву заглавной', () => {
      expect(firstCapital('hello')).toBe('Hello');
      expect(firstCapital('HELLO')).toBe('Hello');
      expect(firstCapital('hELLO WORLD')).toBe('Hello world');
    });

    it('должен обрабатывать пустую строку', () => {
      expect(firstCapital('')).toBe('');
    });

    it('должен игнорировать параметр uppercase', () => {
      expect(firstCapital('hello', true)).toBe('Hello');
      expect(firstCapital('hello', false)).toBe('Hello');
    });
  });

  describe('trimAndUppercase', () => {
    it('должен удалять пробелы по краям', () => {
      expect(trimAndUppercase('  hello  ')).toBe('hello');
      expect(trimAndUppercase('\thello\n')).toBe('hello');
    });

    it('должен преобразовывать в верхний регистр при uppercase=true', () => {
      expect(trimAndUppercase('  hello  ', true)).toBe('HELLO');
      expect(trimAndUppercase('  World  ', true)).toBe('WORLD');
    });

    it('не должен изменять регистр при uppercase=false', () => {
      expect(trimAndUppercase('  Hello  ')).toBe('Hello');
      expect(trimAndUppercase('  WoRlD  ')).toBe('WoRlD');
    });
  });
});

describe('getFirstElement', () => {
  it('должен возвращать первый элемент массива', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
    expect(getFirstElement(['a', 'b', 'c'])).toBe('a');
    expect(getFirstElement([true, false])).toBe(true);
  });

  it('должен возвращать undefined для пустого массива', () => {
    expect(getFirstElement([])).toBeUndefined();
  });

  it('должен работать с массивами объектов', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    expect(getFirstElement([obj1, obj2])).toBe(obj1);
  });
});

describe('findById', () => {
  it('должен находить элемент по id', () => {
    const users = [
      { id: 1, name: 'Анна' },
      { id: 2, name: 'Полина' },
      { id: 3, name: 'Юлия' }
    ];
    
    expect(findById(users, 2)).toEqual({ id: 2, name: 'Полина' });
    expect(findById(users, 1)).toEqual({ id: 1, name: 'Анна' });
  });

  it('должен возвращать undefined для несуществующего id', () => {
    const users = [
      { id: 1, name: 'Анна' },
      { id: 2, name: 'Полина' }
    ];
    
    expect(findById(users, 99)).toBeUndefined();
  });

  it('должен работать с разными типами объектов', () => {
    const items = [
      { id: 10, value: 'test' },
      { id: 20, value: 'example' }
    ];
    
    expect(findById(items, 20)).toEqual({ id: 20, value: 'example' });
  });

  it('должен возвращать undefined для пустого массива', () => {
    expect(findById([], 1)).toBeUndefined();
  });
});