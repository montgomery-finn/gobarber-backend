import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

interface ICachedData {
    [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
    private cache: ICachedData = {};

    public async save(key: string, value: any): Promise<void> {
        this.cache[key] = JSON.stringify(value);
    }

    public async recover<T>(key: string): Promise<T | null> {
        const data = this.cache[key];

        if (!data) return null;

        return JSON.parse(data) as T;
    }

    public async invalidate(key: string): Promise<void> {
        delete this.cache[key];
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = Object.keys(this.cache).filter(k =>
            k.startsWith(`${prefix}:`),
        );

        keys.forEach(k => {
            delete this.cache[k];
        });
    }
}
