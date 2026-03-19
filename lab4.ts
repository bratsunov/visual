export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

export function query<T>(...steps: Array<Transform<T> | GroupTransform<T, any>>): Transform<T> {
    return (data: T[]): T[] => {
        let result: any = data;
        
        for (const step of steps) {
            result = step(result);
        }
        
        return result as T[];
    };
}

export const where: Where<any> = (key, value) => (data) => 
    data.filter((item: any) => item[key] === value);

export const sort: Sort<any> = (key) => (data) => 
    [...data].sort((a: any, b: any) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    });

export const groupBy: GroupBy<any> = (key) => (data) => {
    const groupsMap = new Map<any, Group<any, any>>();
    
    data.forEach((item: any) => {
        const groupKey = item[key];
        
        if (!groupsMap.has(groupKey)) {
            groupsMap.set(groupKey, { key: groupKey, items: [] });
        }
        
        const group = groupsMap.get(groupKey);
        if (group) {
            group.items.push(item);
        }
    });
    
    return Array.from(groupsMap.values());
};

export const having: Having<any> = (predicate) => (groups) => 
    groups.filter((group: Group<any, any>) => predicate(group));