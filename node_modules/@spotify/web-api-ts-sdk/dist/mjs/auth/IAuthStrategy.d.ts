import type { AccessToken, SdkConfiguration } from "../types.js";
export declare const emptyAccessToken: AccessToken;
export declare function isEmptyAccessToken(value: any): boolean;
export default interface IAuthStrategy {
    setConfiguration(configuration: SdkConfiguration): void;
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
}
