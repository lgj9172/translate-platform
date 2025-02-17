import { PaginationParams } from "./clients";

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends object
    ? SnakeToCamel<T[K]>
    : T[K];
};

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Uppercase<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
  : S;

type CamelToSnake<T> = {
  [K in keyof T as CamelToSnakeCase<K & string>]: T[K] extends object
    ? CamelToSnake<T[K]>
    : T[K];
};

export const createQueryString = ({ start, size, order }: PaginationParams) =>
  new URLSearchParams({
    ...(start !== undefined && { start: String(start) }),
    ...(size !== undefined && { size: String(size) }),
    ...(order !== undefined && { order: String(order) }),
  }).toString();

export const snakeToCamel = <T extends object>(obj: T): SnakeToCamel<T> => {
  const camelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelCase(key),
      value instanceof Object && !Array.isArray(value)
        ? snakeToCamel(value)
        : value,
    ]),
  ) as SnakeToCamel<T>;
};

export const camelToSnake = <T extends object>(obj: T): CamelToSnake<T> => {
  const snakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      snakeCase(key),
      value instanceof Object && !Array.isArray(value)
        ? camelToSnake(value)
        : value,
    ]),
  ) as CamelToSnake<T>;
};
