"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class UsersEndpoints extends EndpointsBase_js_1.default {
    profile(userId) {
        return this.getRequest(`users/${userId}`);
    }
}
exports.default = UsersEndpoints;
//# sourceMappingURL=UsersEndpoints.js.map