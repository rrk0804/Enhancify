import type { IHandleErrors } from "../types.js";
export default class ConsoleLoggingErrorHandler implements IHandleErrors {
    handleErrors(error: any): Promise<boolean>;
}
