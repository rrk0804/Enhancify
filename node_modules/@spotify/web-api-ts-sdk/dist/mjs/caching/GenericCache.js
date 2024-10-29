import { isEmptyAccessToken } from "../auth/IAuthStrategy.js";
export default class GenericCache {
    storage;
    updateFunctions;
    autoRenewInterval;
    autoRenewWindow;
    constructor(storage, updateFunctions = new Map(), autoRenewInterval = 0, autoRenewWindow = 2 * 60 * 1000 // Two minutes
    ) {
        this.storage = storage;
        this.updateFunctions = updateFunctions;
        this.autoRenewInterval = autoRenewInterval;
        this.autoRenewWindow = autoRenewWindow;
        if (this.autoRenewInterval > 0) {
            setInterval(() => this.autoRenewRenewableItems(), this.autoRenewInterval);
        }
    }
    async getOrCreate(cacheKey, createFunction, updateFunction) {
        if (updateFunction) {
            this.updateFunctions.set(cacheKey, updateFunction);
        }
        const item = await this.get(cacheKey);
        if (item) {
            return item;
        }
        const newCacheItem = await createFunction();
        if (!newCacheItem) {
            throw new Error("Could not create cache item");
        }
        if (!isEmptyAccessToken(newCacheItem)) {
            this.setCacheItem(cacheKey, newCacheItem);
        }
        return newCacheItem;
    }
    async get(cacheKey) {
        let asString = this.storage.get(cacheKey);
        let cachedItem = asString ? JSON.parse(asString) : null;
        if (this.itemDueToExpire(cachedItem) && this.updateFunctions.has(cacheKey)) {
            const updateFunction = this.updateFunctions.get(cacheKey);
            await this.tryUpdateItem(cacheKey, cachedItem, updateFunction);
            // Ensure updated item is returned
            asString = this.storage.get(cacheKey);
            cachedItem = asString ? JSON.parse(asString) : null;
        }
        if (!cachedItem) {
            return null;
        }
        if (cachedItem.expires && (cachedItem.expires === -1 || cachedItem.expires <= Date.now())) {
            this.remove(cacheKey);
            return null;
        }
        if (cachedItem.expiresOnAccess && cachedItem.expiresOnAccess === true) {
            this.remove(cacheKey);
            return cachedItem;
        }
        return cachedItem;
    }
    set(cacheKey, value, expiresIn) {
        const expires = Date.now() + expiresIn;
        const cacheItem = { ...value, expires };
        this.setCacheItem(cacheKey, cacheItem);
    }
    setCacheItem(cacheKey, cacheItem) {
        const asString = JSON.stringify(cacheItem);
        this.storage.set(cacheKey, asString);
    }
    remove(cacheKey) {
        this.storage.remove(cacheKey);
    }
    itemDueToExpire(item) {
        if (!item) {
            return false;
        }
        if (!item.expires) {
            return false;
        }
        return item.expires - Date.now() < (this.autoRenewWindow);
    }
    async autoRenewRenewableItems() {
        this.updateFunctions.forEach(async (updateFunction, key) => {
            const cachedItem = await this.get(key);
            if (!cachedItem) {
                return;
            }
            if (updateFunction && this.itemDueToExpire(cachedItem)) {
                await this.tryUpdateItem(key, cachedItem, updateFunction);
            }
        });
    }
    async tryUpdateItem(key, cachedItem, updateFunction) {
        try {
            const updated = await updateFunction(cachedItem);
            if (updated) {
                this.setCacheItem(key, updated);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
//# sourceMappingURL=GenericCache.js.map