export default class EndpointsBase {
    api;
    constructor(api) {
        this.api = api;
    }
    async getRequest(url) {
        return await this.api.makeRequest("GET", url);
    }
    async postRequest(url, body, contentType = undefined) {
        return await this.api.makeRequest("POST", url, body, contentType);
    }
    async putRequest(url, body, contentType = undefined) {
        return await this.api.makeRequest("PUT", url, body, contentType);
    }
    async deleteRequest(url, body) {
        return await this.api.makeRequest("DELETE", url, body);
    }
    paramsFor(args) {
        const params = new URLSearchParams();
        for (let key of Object.getOwnPropertyNames(args)) {
            if (args[key] || (args[key] === 0) || (!args[key] && typeof args[key] === 'boolean')) {
                params.append(key, args[key].toString());
            }
        }
        return [...params].length > 0 ? `?${params.toString()}` : "";
    }
}
//# sourceMappingURL=EndpointsBase.js.map