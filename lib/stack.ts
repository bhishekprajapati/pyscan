export class BoundedStack<T> {
  private items: T[] = [];

  constructor(private limit: number) {}

  push(param: T | T[]) {
    const items = Array.isArray(param) ? param : [param];
    const sliced = this.items.slice(0, this.limit - items.length);
    this.items = items.concat(sliced);
    return this;
  }

  toArray(): T[] {
    return [...this.items];
  }

  get size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
