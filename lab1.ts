export interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return {
        id,
        name,
        email,
        isActive
    };
}

export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: 'fiction' | 'non-fiction';
}

export function createBook(book: Book): Book {
    return book;
}

export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') return Math.PI * param * param;
    return param * param;
}

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    if (status === 'active') return 'green';
    if (status === 'inactive') return 'red';
    return 'blue';
}

export type StringFormatter = (input: string, uppercase?: boolean) => string;

export const firstCapital: StringFormatter = (input, uppercase = false) => {
    if (input.length === 0) return input;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

export const trimAndUppercase: StringFormatter = (input, uppercase = false) => {
    const trimmed = input.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}

console.log('Users:');
const user = createUser(1, 'Андрей Рублев');
console.log(user);

console.log('Books:');
const book1 = createBook({ title: 'Война и мир', author: 'Лев Толстой', year: 1869, genre: 'non-fiction' });
const book2 = createBook({ title: 'Террор', author: 'Дэн Симмон', genre: 'fiction' });
console.log(book1, book2);

console.log('Area:');
console.log('Площадь круга:', calculateArea('circle', 5));
console.log('Площадь квадрата:', calculateArea('square', 4));

console.log('Status:');
console.log('active -', getStatusColor('active'));
console.log('inactive -', getStatusColor('inactive'));
console.log('new -', getStatusColor('new'));

console.log('Formatting:');
console.log(firstCapital('hello world'));
console.log(trimAndUppercase(' hello world ', true));

console.log('First element:');
console.log('[1, 2, 3] - ', getFirstElement([1, 2, 3]));
console.log('[a, b, c] - ', getFirstElement(['a', 'b', 'c']));
console.log('Пустой массив - ', getFirstElement([]));

console.log('ID:');
const users = [
    { id: 1, name: 'Анна' },
    { id: 2, name: 'Полина' },
    { id: 3, name: 'Юлия' }
];
console.log('Поиск по id=2:', findById(users, 2));