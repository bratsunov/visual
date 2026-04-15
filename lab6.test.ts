import { describe, it, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('Утилитарные типы', () => {
    describe('DeepReadonly<T>', () => {
        it('делает все свойства объекта readonly (включая вложенные)', () => {
            type User = {
                id: number;
                name: string;
                address: {
                    city: string;
                    street: string;
                };
            };
            
            type ReadonlyUser = DeepReadonly<User>;
            
            expectTypeOf<ReadonlyUser>().toMatchTypeOf<{
                readonly id: number;
                readonly name: string;
                readonly address: {
                    readonly city: string;
                    readonly street: string;
                };
            }>();
            
            expectTypeOf<ReadonlyUser['address']>().toMatchTypeOf<{
                readonly city: string;
                readonly street: string;
            }>();
        });

        it('работает с примитивными типами', () => {
            type Primitive = DeepReadonly<string>;
            expectTypeOf<Primitive>().toBeString();
        });

        it('работает с массивами', () => {
            type Data = {
                items: { id: number }[];
            };
            
            type ReadonlyData = DeepReadonly<Data>;
            
            expectTypeOf<ReadonlyData['items']>().toMatchTypeOf<readonly { readonly id: number }[]>();
        });

        it('работает с пустым объектом', () => {
            type Empty = DeepReadonly<{}>;
            expectTypeOf<Empty>().toEqualTypeOf<{}>();
        });
    });

    describe('PickedByType<T, U>', () => {
        it('выбирает свойства типа string', () => {
            type Example = {
                id: number;
                name: string;
                age: number;
                city: string;
                active: boolean;
            };
            
            type StringProps = PickedByType<Example, string>;
            
            expectTypeOf<StringProps>().toEqualTypeOf<{
                name: string;
                city: string;
            }>();
        });

        it('выбирает свойства типа number', () => {
            type Example = {
                id: number;
                name: string;
                age: number;
                city: string;
            };
            
            type NumberProps = PickedByType<Example, number>;
            
            expectTypeOf<NumberProps>().toEqualTypeOf<{
                id: number;
                age: number;
            }>();
        });

        it('возвращает пустой объект если нет свойств нужного типа', () => {
            type Example = {
                name: string;
                city: string;
            };
            
            type NumberProps = PickedByType<Example, number>;
            
            expectTypeOf<NumberProps>().toEqualTypeOf<{}>();
        });

        it('работает с boolean', () => {
            type Example = {
                isActive: boolean;
                name: string;
                isDeleted: boolean;
            };
            
            type BooleanProps = PickedByType<Example, boolean>;
            
            expectTypeOf<BooleanProps>().toEqualTypeOf<{
                isActive: boolean;
                isDeleted: boolean;
            }>();
        });

        it('работает с объединением типов', () => {
            type Example = {
                id: number;
                name: string | number;
                age: number;
                data: string | null;
            };
            
            type StringOrNumberProps = PickedByType<Example, string | number>;
            
            expectTypeOf<StringOrNumberProps>().toEqualTypeOf<{
                id: number;
                name: string | number;
                age: number;
                data: string | null;
            }>();
        });
    });

    describe('EventHandlers<T>', () => {
        it('генерирует обработчики onEventName для каждого события', () => {
            type EventMap = {
                click: { x: number; y: number };
                submit: { data: string };
                focus: void;
            };
            
            type Handlers = EventHandlers<EventMap>;
            
            expectTypeOf<Handlers>().toEqualTypeOf<{
                onClick: (event: { x: number; y: number }) => void;
                onSubmit: (event: { data: string }) => void;
                onFocus: (event: void) => void;
            }>();
        });

        it('корректно обрабатывает пустой объект', () => {
            type EmptyHandlers = EventHandlers<{}>;
            expectTypeOf<EmptyHandlers>().toEqualTypeOf<{}>();
        });

        it('работает с одним событием', () => {
            type SingleEvent = {
                change: { value: string };
            };
            
            type Handlers = EventHandlers<SingleEvent>;
            
            expectTypeOf<Handlers>().toEqualTypeOf<{
                onChange: (event: { value: string }) => void;
            }>();
        });

        it('сохраняет тип события в обработчике', () => {
            type EventMap = {
                click: { x: number; y: number };
                submit: { data: string };
            };
            
            type Handlers = EventHandlers<EventMap>;
            
            expectTypeOf<Parameters<Handlers['onClick']>[0]>().toEqualTypeOf<{
                x: number;
                y: number;
            }>();
            
            expectTypeOf<Parameters<Handlers['onSubmit']>[0]>().toEqualTypeOf<{
                data: string;
            }>();
        });

        it('работает с событиями разных типов', () => {
            type MixedEvents = {
                click: number;
                input: string;
                toggle: boolean;
            };
            
            type Handlers = EventHandlers<MixedEvents>;
            
            expectTypeOf<Handlers>().toEqualTypeOf<{
                onClick: (event: number) => void;
                onInput: (event: string) => void;
                onToggle: (event: boolean) => void;
            }>();
        });
    });
});