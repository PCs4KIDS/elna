export class Store {
  constructor(private storeKey = 'elna') {}

  get(key) {
    return localStorage.getItem(this.getRealKey(key));
  }

  set(key, value) {
    return localStorage.setItem(this.getRealKey(key), value);
  }

  private getRealKey(key) {
    return `${this.storeKey}::${key}`;
  }
}