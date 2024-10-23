import type { User } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class UsersEndpoints extends EndpointsBase {
    profile(userId: string): Promise<User>;
}
