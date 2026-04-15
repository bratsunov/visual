export type Transform<T> = (data: T[]) => T[];
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;
export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;
export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

type PipelineState = 'start' | 'hasWhere' | 'hasGroupBy' | 'hasHaving';

type WhereOp<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
type GroupByOp<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;
type HavingOp<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;
type SortOp<T> = <K extends keyof T>(key: K) => Transform<T>;

type ValidateOrder<T, Steps extends any[], State extends PipelineState> = 
    Steps extends [] ? true :
    Steps extends [infer First, ...infer Rest] ? (
        First extends WhereOp<T> ? ValidateOrder<T, Rest, 'hasWhere'> :
        First extends GroupByOp<T> ? (
            State extends 'hasWhere' | 'hasGroupBy' | 'hasHaving' | 'start' ? 
                ValidateOrder<T, Rest, 'hasGroupBy'> : false
        ) :
        First extends HavingOp<T> ? (
            State extends 'hasGroupBy' ? ValidateOrder<T, Rest, 'hasHaving'> : false
        ) :
        First extends SortOp<T> ? (
            State extends 'hasWhere' | 'hasGroupBy' | 'hasHaving' ? 
                ValidateOrder<T, Rest, 'hasHaving'> : false
        ) : false
    ) : false;

export function query<T, Steps extends any[]>(
    ...steps: Steps & (ValidateOrder<T, Steps, 'start'> extends true ? {} : never)
): Transform<T> {
    return (data: T[]): T[] => {
        let result: any = data;
        
        for (const step of steps) {
            result = step(result);
        }
        
        return result as T[];
    };
}

export const where: WhereOp<any> = (key, value) => (data) => 
    data.filter((item: any) => item[key] === value);

export const sort: SortOp<any> = (key) => (data) => 
    [...data].sort((a: any, b: any) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    });

export const groupBy: GroupByOp<any> = (key) => (data) => {
    const groupsMap = new Map<any, any>();
    
    for (const item of data) {
        const groupKey = (item as any)[key];
        
        if (!groupsMap.has(groupKey)) {
            groupsMap.set(groupKey, { key: groupKey, items: [] });
        }
        
        groupsMap.get(groupKey).items.push(item);
    }
    
    const result = [];
    for (const value of groupsMap.values()) {
        result.push(value);
    }
    return result;
};

export const having: HavingOp<any> = (predicate) => (groups) => 
    groups.filter((group: any) => predicate(group));