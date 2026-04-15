import { describe, it, expect, expectTypeOf } from 'vitest';
import { 
    query, where, sort, groupBy, having, type Group
} from './lab5';

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
    { id: 5, name: "Anna", surname: "Kelly", age: 28, city: "NY" },
    { id: 6, name: "Anna", surname: "Kelly", age: 32, city: "LA" },
];

describe('Cистема типов должна задавать строгий порядок', () => {
    describe('Правильный порядок операторов', () => {
        it('должен разрешать несколько where подряд', () => {
            const search = query<User>(
                where("name", "John"),
                where("surname", "Doe"),
                sort("age"),
            );
            
            expectTypeOf(search).toBeFunction();
            const result = search(users);
            expect(result).toBeDefined();
        });

        it('должен разрешать where → groupBy → having', () => {
            const pipeline = query<User>(
                where("surname", "Doe"),
                groupBy("city"),
                having((group) => group.items.some((u: User) => u.age > 34)),
            );
            
            expectTypeOf(pipeline).toBeFunction();
        });

        it('должен разрешать where → sort', () => {
            const pipeline = query<User>(
                where("city", "NY"),
                sort("name"),
            );
            
            expectTypeOf(pipeline).toBeFunction();
        });

        it('должен разрешать groupBy → having', () => {
            const pipeline = query<User>(
                groupBy("city"),
                having((group) => group.items.length > 1),
            );
            
            expectTypeOf(pipeline).toBeFunction();
        });

        it('должен разрешать пустой конвейер', () => {
            const pipeline = query<User>();
            expectTypeOf(pipeline).toBeFunction();
        });
    });

    describe('Фильтрация и сортировка', () => {
        it('должен фильтровать по имени и фамилии и сортировать по возрасту', () => {
            const search = query<User>(
                where("name", "John"),
                where("surname", "Doe"),
                sort("age"),
            );
            
            const result = search(users);
            
            expect(result).toEqual([
                { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
                { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
                { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
            ]);
        });

        it('должен фильтровать по городу и сортировать по имени', () => {
            const search = query<User>(
                where("city", "NY"),
                sort("name"),
            );
            
            const result = search(users);
            
            expect(result).toEqual([
                { id: 5, name: "Anna", surname: "Kelly", age: 28, city: "NY" },
                { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
                { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
            ]);
        });
    });

    describe('Группировка и фильтр по группам', () => {
        it('должен группировать по городу и оставить группы с более чем 1 элементом', () => {
            const groupAndFilter = query<User>(
                groupBy("city"),
                having((group) => group.items.length > 1),
            );
            
            const result = groupAndFilter(users) as any[];
            
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("NY");
            expect(result[0].items).toHaveLength(3);
            expect(result[1].key).toBe("LA");
            expect(result[1].items).toHaveLength(3);
        });

        it('должен группировать по имени и оставить группы, где все элементы имеют возраст > 30', () => {
            const groupAndFilter = query<User>(
                groupBy("name"),
                having((group) => group.items.every((user: User) => user.age > 30)),
            );
            
            const result = groupAndFilter(users) as any[];
            
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("John");
            expect(result[1].key).toBe("Mike");
            
            const johnGroup = result.find((g: any) => g.key === "John");
            expect(johnGroup.items.every((u: User) => u.age > 30)).toBe(true);
            
            const mikeGroup = result.find((g: any) => g.key === "Mike");
            expect(mikeGroup.items.every((u: User) => u.age > 30)).toBe(true);
        });
    });

    describe('Комбинированный конвейер', () => {
        it('должен фильтровать, группировать и фильтровать группы (оставить группы с элементами > 34)', () => {
            const pipeline = query<User>(
                where("surname", "Doe"),
                groupBy("city"),
                having((group) => group.items.some((u: User) => u.age > 34)),
            );
            
            const result = pipeline(users) as any[];
            
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("LA");
            expect(result[0].items).toHaveLength(2);
            expect(result[0].items.every((u: User) => u.surname === "Doe")).toBe(true);
        });

        it('должен фильтровать, группировать и фильтровать группы (оставить группы с 2+ элементами)', () => {
            const pipeline = query<User>(
                where("surname", "Doe"),
                groupBy("city"),
                having((group) => group.items.length >= 2),
            );
            
            const result = pipeline(users) as any[];
            
            expect(result).toHaveLength(2);
            
            const nyGroup = result.find((g: any) => g.key === "NY");
            const laGroup = result.find((g: any) => g.key === "LA");
            
            expect(nyGroup).toBeDefined();
            expect(laGroup).toBeDefined();
            
            expect(nyGroup?.items).toHaveLength(2);
            expect(nyGroup?.items.every((u: User) => u.surname === "Doe")).toBe(true);
            
            expect(laGroup?.items).toHaveLength(2);
            expect(laGroup?.items.every((u: User) => u.surname === "Doe")).toBe(true);
        });

        it('должен фильтровать, сортировать, группировать и фильтровать группы', () => {
            const complexPipeline = query<User>(
                where("city", "NY"),
                sort("age"),
                groupBy("name"),
                having((group) => group.items.length >= 1),
            );
            
            const result = complexPipeline(users) as any[];
            
            expect(result).toHaveLength(2);
            
            const annaGroup = result.find((g: any) => g.key === "Anna");
            const johnGroup = result.find((g: any) => g.key === "John");
            
            expect(annaGroup).toBeDefined();
            expect(johnGroup).toBeDefined();
            
            expect(annaGroup?.items).toHaveLength(1);
            expect(annaGroup?.items[0].age).toBe(28);
            
            expect(johnGroup?.items).toHaveLength(2);
            expect(johnGroup?.items[0].age).toBe(33);
            expect(johnGroup?.items[1].age).toBe(34);
        });
    });

    describe('Краевые случаи', () => {
        it('должен обрабатывать пустой массив', () => {
            const pipeline = query<User>(
                where("city", "NY"),
                sort("age"),
                groupBy("name"),
            );
            
            const result = pipeline([]) as any[];
            expect(result).toEqual([]);
        });

        it('должен обрабатывать конвейер без шагов', () => {
            const pipeline = query<User>();
            const result = pipeline(users);
            expect(result).toEqual(users);
        });

        it('должен корректно работать с where, который не находит элементов', () => {
            const pipeline = query<User>(
                where("city", "Moscow"),
            );
            
            const result = pipeline(users);
            expect(result).toEqual([]);
        });

        it('должен корректно работать с having, который отбрасывает все группы', () => {
            const pipeline = query<User>(
                groupBy("city"),
                having((group) => group.items.length > 10),
            );
            
            const result = pipeline(users) as any[];
            expect(result).toEqual([]);
        });
    });
});