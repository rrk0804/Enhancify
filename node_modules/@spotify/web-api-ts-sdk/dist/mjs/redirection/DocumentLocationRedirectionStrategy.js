export default class DocumentLocationRedirectionStrategy {
    async redirect(targetUrl) {
        document.location = targetUrl.toString();
    }
    async onReturnFromRedirect() {
    }
}
//# sourceMappingURL=DocumentLocationRedirectionStrategy.js.map