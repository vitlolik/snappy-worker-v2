import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async withCache<Result>(
    key: string,
    ttl = 5000,
    callback: () => Promise<Result>,
  ): Promise<Result> {
    const valueFromCache = await this.cacheManager.get<Result>(key);

    if (valueFromCache !== undefined) {
      return valueFromCache;
    }

    const result = await callback();
    await this.cacheManager.set(key, result, ttl);

    return result;
  }

  async clear(): Promise<void> {
    await this.cacheManager.reset();
  }
}
