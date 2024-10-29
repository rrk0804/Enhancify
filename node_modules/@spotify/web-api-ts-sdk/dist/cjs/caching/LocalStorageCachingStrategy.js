"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenericCache_js_1 = __importDefault(require("./GenericCache.js"));
class LocalStorageCachingStrategy extends GenericCache_js_1.default {
    constructor() {
        super(new LocalStorageCacheStore());
    }
}
exports.default = LocalStorageCachingStrategy;
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