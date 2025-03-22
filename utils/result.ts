class Data<T> {
  #data: T;
  constructor(value: T) {
    this.#data = value;
  }

  get data(): T {
    return this.#data;
  }
}

class Err<T> {
  #error: T;
  constructor(value: T) {
    this.#error = value;
  }

  get error() {
    return this.#error;
  }
}

class Result<D = never, E = never> {
  constructor(private val: Data<D> | Err<E>) {}

  unwrap() {
    if (this.val instanceof Err) {
      throw this.val.error;
    }
    return this.val.data;
  }

  get value() {
    if (this.val instanceof Err) {
      return {
        ok: false as const,
        error: this.val.error,
      };
    }

    return {
      ok: true as const,
      data: this.val.data,
    };
  }

  static error<T>(value: T) {
    return new Result<never, T>(new Err(value));
  }

  static data<T>(value: T) {
    return new Result<T, never>(new Data(value));
  }
}

type MaybePromise<T> = T | Promise<T>;

export function resultify<T extends (...args: any[]) => Data<any> | Err<any>>(
  fn: T,
) {
  return function () {};
}
