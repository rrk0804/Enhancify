"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentLocationRedirectionStrategy {
    async redirect(targetUrl) {
        document.location = targetUrl.toString();
    }
    async onReturnFromRedirect() {
    }
}
exports.default = DocumentLocationRedirectionStrategy;
//# sourceMappingURL=DocumentLocationRedirectionStrategy.js.map