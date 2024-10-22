"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
class Crypto {
    static get current() {
        return this.hasSubtleCrypto ? window.crypto : this.tryLoadNodeWebCrypto();
    }
    static get hasSubtleCrypto() {
        return typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined';
    }
    static tryLoadNodeWebCrypto() {
        try {
            // Deliberately avoid bundling for browsers depending
            // on node by doing this require during execution.
            const { webcrypto } = require('crypto');
            return webcrypto;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=Crypto.js.map