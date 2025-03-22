declare const brand: unique symbol;

type Brand<T, U> = T & { [brand]: U };
