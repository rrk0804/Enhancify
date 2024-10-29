import type { IValidateResponses } from "../types.js";
export default class DefaultResponseValidator implements IValidateResponses {
    validateResponse(response: Response): Promise<void>;
}
