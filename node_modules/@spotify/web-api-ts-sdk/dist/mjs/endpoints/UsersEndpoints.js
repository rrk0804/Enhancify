import EndpointsBase from './EndpointsBase.js';
export default class UsersEndpoints extends EndpointsBase {
    profile(userId) {
        return this.getRequest(`users/${userId}`);
    }
}
//# sourceMappingURL=UsersEndpoints.js.map