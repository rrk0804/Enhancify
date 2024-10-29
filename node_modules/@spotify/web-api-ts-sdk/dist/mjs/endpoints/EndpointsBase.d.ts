import { SpotifyApi } from "../SpotifyApi.js";
export default class EndpointsBase {
    protected api: SpotifyApi;
    constructor(api: SpotifyApi);
    protected getRequest<TReturnType>(url: string): Promise<TReturnType>;
    protected postRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType?: string | undefined): Promise<TReturnType>;
    protected putRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType?: string | undefined): Promise<TReturnType>;
    protected deleteRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType>;
    protected paramsFor(args: any): string;
}
