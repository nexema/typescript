import { BaseNexemaType } from "./type";
import { NexemaTypeInfo } from "./type_info";

export const NexemaReflection = {
  /**
   * Checks if value is a BaseNexemaType.
   *
   * @param value The value to check.
   * @returns A boolean indicating whatever value is a BaseNexemaType.
   */
  isNexemaType(value: unknown): boolean {
    return value instanceof BaseNexemaType;
  },

  /**
   * Returns the type info of a possible BaseNexemaType. If value is not a BaseNexemaType, it will return undefined
   *
   * @param value The value to get its type info.
   */
  getTypeInfo(value: unknown): NexemaTypeInfo | undefined {
    if (value instanceof BaseNexemaType) {
      return value.getTypeInfo();
    }

    return undefined;
  },
} as const;
