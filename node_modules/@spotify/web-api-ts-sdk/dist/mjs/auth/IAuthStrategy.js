export const emptyAccessToken = { access_token: "emptyAccessToken", token_type: "", expires_in: 0, refresh_token: "", expires: -1 };
export function isEmptyAccessToken(value) {
    return value === emptyAccessToken;
}
//# sourceMappingURL=IAuthStrategy.js.map