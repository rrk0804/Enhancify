import type { IResponseDeserializer } from "../types.js";
export default class DefaultResponseDeserializer implements IResponseDeserializer {
    deserialize<TReturnType>(response: Response): Promise<TReturnType>;
}
