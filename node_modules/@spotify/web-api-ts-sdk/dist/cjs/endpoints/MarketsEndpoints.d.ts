import type { Markets } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class MarketsEndpoints extends EndpointsBase {
    getAvailableMarkets(): Promise<Markets>;
}
