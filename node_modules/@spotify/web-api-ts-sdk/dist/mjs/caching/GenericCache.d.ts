import { ICachingStrategy, ICachable } from "../types.js";
import { ICacheStore } from "./ICacheStore.js";
export default class GenericCache implements ICachingStrategy {
    private storage;
    private updateFunctions;
    private autoRenewInterval;
    private autoRenewWindow;
    constructor(storage: ICacheStore, updateFunctions?: Map<string, (item: any) => Promise<ICachable>>, autoRenewInterval?: number, autoRenewWindow?: number);
    getOrCreate<T>(cacheKey: string, createFunction: () => Promise<T & ICachable & object>, updateFunction?: (item: T) => Promise<T & ICachable & object>): Promise<T & ICachable>;
    get<T>(cacheKey: string): Promise<T & ICachable | null>;
    set(cacheKey: string, value: object, expiresIn: number): void;
    setCacheItem(cacheKey: string, cacheItem: ICachable): void;
    remove(cacheKey: string): void;
    private itemDueToExpire;
    private autoRenewRenewableItems;
    private tryUpdateItem;
}
