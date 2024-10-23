import GenericCache from "./GenericCache.js";
export default class InMemoryCachingStrategy extends GenericCache {
    constructor() {
        super(new DictionaryCacheStore());
    }
}
class DictionaryCacheStore {
    cache = new Map();
    get(key) {
        return this.cache.get(key) ?? null;
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    remove(key) {
        this.cache.delete(key);
    }
}
//# sourceMappingURL=InMemoryCachingStrategy.js.map