import nodeCache from 'node-cache';

export class Cache {
  private cache;

  constructor() {
    this.cache = new nodeCache({
      stdTTL: 24 * 60 * 60,
    });
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  del(key: string) {
    this.cache.del(key);
  }
}

const cache = new Cache();
export default cache;
