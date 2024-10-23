"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenericCache_js_1 = __importDefault(require("./GenericCache.js"));
class InMemoryCachingStrategy extends GenericCache_js_1.default {
    constructor() {
        super(new DictionaryCacheStore());
    }
}
exports.default = InMemoryCachingStrategy;
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