export default class DefaultResponseDeserializer {
    async deserialize(response) {
        const text = await response.text();
        if (text.length > 0) {
            const json = JSON.parse(text);
            return json;
        }
        return null;
    }
}
//# sourceMappingURL=DefaultResponseDeserializer.js.map