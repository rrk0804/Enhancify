"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultResponseDeserializer {
    async deserialize(response) {
        const text = await response.text();
        if (text.length > 0) {
            const json = JSON.parse(text);
            return json;
        }
        return null;
    }
}
exports.default = DefaultResponseDeserializer;
//# sourceMappingURL=DefaultResponseDeserializer.js.map