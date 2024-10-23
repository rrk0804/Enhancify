"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyAccessToken = exports.emptyAccessToken = void 0;
exports.emptyAccessToken = { access_token: "emptyAccessToken", token_type: "", expires_in: 0, refresh_token: "", expires: -1 };
function isEmptyAccessToken(value) {
    return value === exports.emptyAccessToken;
}
exports.isEmptyAccessToken = isEmptyAccessToken;
//# sourceMappingURL=IAuthStrategy.js.map