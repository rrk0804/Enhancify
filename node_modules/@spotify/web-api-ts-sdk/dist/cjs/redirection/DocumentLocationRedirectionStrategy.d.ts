import type { IRedirectionStrategy } from "../types.js";
export default class DocumentLocationRedirectionStrategy implements IRedirectionStrategy {
    redirect(targetUrl: string | URL): Promise<void>;
    onReturnFromRedirect(): Promise<void>;
}
