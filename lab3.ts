import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (!input || input.length === 0) {
        throw new Error('Массив пуст');
    }

    const headers = input[0].split(delimiter);

    if (headers.length === 0 || headers.some(h => h.trim() === '')) {
        throw new Error('Пустые заголовки');
    }

    const result: object[] = [];

    for (let i = 1; i < input.length; i++) {
        const values = input[i].split(delimiter);

        if (values.length !== headers.length) {
            throw new Error(`Несовпадение количества столбцов в строке ${i + 1}`);
        }

        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j].trim();
            let value: any = values[j].trim();
            
            if (/^-?\d+$/.test(value)) {
                value = parseInt(value, 10);
            } else if (/^-?\d+\.\d+$/.test(value)) {
                value = parseFloat(value);
            }
            
            obj[header] = value;
        }

        result.push(obj);
    }

    return result;
}

export async function formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    try {
        const fileContent = await readFile(input, 'utf-8');

        const lines = fileContent.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        if (lines.length === 0) {
            throw new Error('Файл пуст');
        }

        const jsonData = csvToJSON(lines, delimiter);
        
        await writeFile(output, JSON.stringify(jsonData, null, 2), 'utf-8');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Ошибка обработки файла: ${error.message}`);
        }
        throw new Error(`Ошибка обработки файла: ${String(error)}`);
    }
}