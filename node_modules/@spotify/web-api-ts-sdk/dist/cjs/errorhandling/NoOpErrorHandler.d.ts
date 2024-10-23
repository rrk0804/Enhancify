import type { IHandleErrors } from "../types.js";
export default class NoOpErrorHandler implements IHandleErrors {
    handleErrors(_: any): Promise<boolean>;
}
