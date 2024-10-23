import GenericCache from "./GenericCache.js";
export default class LocalStorageCachingStrategy extends GenericCache {
    constructor() {
        super(new LocalStorageCacheStore());
    }
}
class LocalStorageCacheStore {
    get(key) {
        return localStorage.getItem(key);
    }
    set(key, value) {
        localStorage.setItem(key, value);
    }
    remove(key) {
        localStorage.removeItem(key);
    }
}
//# sourceMappingURL=LocalStorageCachingStrategy.js.map