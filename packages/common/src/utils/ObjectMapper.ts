/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonObject, JsonProperty, JsonConvert, OperationMode } from 'json2typescript';

class ObjectMapper {
  public static serialize<T>(instance: T): any {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;

    return jsonConvert.serializeObject<T>(instance);
  }

  public static serializeArray<T>(instanceArray: T[]): any {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    return jsonConvert.serializeArray<T>(instanceArray);
  }

  public static deserialize<T>(classReference: new () => T, jsonObject: any): T {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;

    return jsonConvert.deserializeObject(jsonObject, classReference);
  }

  public static deserializeArray<T>(classReference: new () => T, jsonArray: any[]): T[] {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    return jsonConvert.deserializeArray<T>(jsonArray, classReference);
  }
}

export { JsonObject, JsonProperty, ObjectMapper };
