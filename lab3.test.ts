import { describe, it, expect, vi, beforeEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './lab3';
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

describe('csvToJSON', () => {
    describe('корректные входные данные', () => {
        it('должен преобразовывать CSV с разделителем ";"', () => {
            const input = ["p1;p2;p3", "1;A;b", "2;B;v"];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { p1: 1, p2: 'A', p3: 'b' },
                { p1: 2, p2: 'B', p3: 'v' }
            ]);
        });

        it('должен преобразовывать CSV с разделителем ","', () => {
            const input = ["p1,p2,p3", "1,A,b", "2,B,v"];
            const result = csvToJSON(input, ',');
            
            expect(result).toEqual([
                { p1: 1, p2: 'A', p3: 'b' },
                { p1: 2, p2: 'B', p3: 'v' }
            ]);
        });

        it('должен обрабатывать числа с плавающей точкой', () => {
            const input = ["p1;p2;p3", "1.5;A;b", "2.7;B;v"];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { p1: 1.5, p2: 'A', p3: 'b' },
                { p1: 2.7, p2: 'B', p3: 'v' }
            ]);
        });

        it('должен обрабатывать отрицательные числа', () => {
            const input = ["p1;p2", "-10;A", "-20;B"];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { p1: -10, p2: 'A' },
                { p1: -20, p2: 'B' }
            ]);
        });

        it('должен обрабатывать пустые строки в значениях', () => {
            const input = ["p1;p2;p3", "1;;b", "2;B;"];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { p1: 1, p2: '', p3: 'b' },
                { p1: 2, p2: 'B', p3: '' }
            ]);
        });

        it('должен обрезать пробелы в заголовках и значениях', () => {
            const input = [" p1 ; p2 ; p3 ", " 1 ; A ; b "];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { p1: 1, p2: 'A', p3: 'b' }
            ]);
        });
    });

    describe('некорректные входные данные', () => {
        it('должен выдавать ошибку при пустом массиве', () => {
            expect(() => csvToJSON([], ';')).toThrow('Массив пуст');
        });

        it('должен выдавать ошибку при несовпадении количества столбцов', () => {
            const input = ["p1;p2;p3", "1;A", "2;B;v;d"];
            
            expect(() => csvToJSON(input, ';')).toThrow('Несовпадение количества столбцов в строке 2');
        });

        it('должен выдавать ошибку при пустых заголовках', () => {
            const input = [";p2;p3", "1;A;b"];
            
            expect(() => csvToJSON(input, ';')).toThrow('Пустые заголовки');
        });

        it('должен выдавать ошибку если нет строк с данными', () => {
            const input = ["p1;p2;p3"];
            
            expect(csvToJSON(input, ';')).toEqual([]);
        });
    });
});

describe('formatCSVFileToJSONFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен читать файл, преобразовывать и записывать результат', async () => {
        const mockCSV = 'p1;p2;p3\n1;A;b\n2;B;v';
        vi.mocked(readFile).mockResolvedValue(mockCSV);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
        
        expect(readFile).toHaveBeenCalledTimes(1);
        expect(readFile).toHaveBeenCalledWith('input.csv', 'utf-8');
        
        expect(writeFile).toHaveBeenCalledTimes(1);
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { p1: 1, p2: 'A', p3: 'b' },
                { p1: 2, p2: 'B', p3: 'v' }
            ], null, 2),
            'utf-8'
        );
    });

    it('должен обрабатывать пустые строки в файле', async () => {
        const mockCSV = 'p1;p2;p3\n\n1;A;b\n\n2;B;v\n';
        vi.mocked(readFile).mockResolvedValue(mockCSV);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
        
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { p1: 1, p2: 'A', p3: 'b' },
                { p1: 2, p2: 'B', p3: 'v' }
            ], null, 2),
            'utf-8'
        );
    });

    it('должен выдавать ошибку если файл пуст', async () => {
        vi.mocked(readFile).mockResolvedValue('');
        
        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow('Ошибка обработки файла: Файл пуст');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('должен пропустить ошибки от csvToJSON', async () => {
        const mockCSV = 'p1;p2;p3\n1;A\n2;B;v;d';
        vi.mocked(readFile).mockResolvedValue(mockCSV);
        
        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow('Ошибка обработки файла: Несовпадение количества столбцов в строке 2');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибки чтения файла', async () => {
        vi.mocked(readFile).mockRejectedValue(new Error('Файл не найден'));
        
        await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
            .rejects.toThrow('Ошибка обработки файла: Файл не найден');
        
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('должен работать с разными разделителями', async () => {
        const mockCSV = 'p1,p2,p3\n1,A,b\n2,B,v';
        vi.mocked(readFile).mockResolvedValue(mockCSV);
        
        await formatCSVFileToJSONFile('input.csv', 'output.json', ',');
        
        expect(writeFile).toHaveBeenCalledWith(
            'output.json',
            JSON.stringify([
                { p1: 1, p2: 'A', p3: 'b' },
                { p1: 2, p2: 'B', p3: 'v' }
            ], null, 2),
            'utf-8'
        );
    });
});