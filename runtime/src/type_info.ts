import { NexemaField } from "./definition";
import { BaseNexemaType } from "./type";

export interface NexemaTypeInfo {
  /**
   * The list of fields by its JavaScript name
   */
  readonly fieldsByJsName: { [key: string]: number };

  /**
   * The list of fields by its index
   */
  readonly fieldsByIndex: { [key: number]: NexemaField };

  /**
   * The Nexema type's kind
   */
  readonly kind: "enum" | "struct" | "union";

  /**
   * The name of the type.
   */
  readonly name: string;

  /**
   * The id of the type.
   */
  readonly typeId: string;

  /**
   * Creates a new, empty instance of the Nexema type.
   * Empty instances contains default values of each field that is required or user-defined default values
   *
   * @returns A new, empty instance of T
   */
  readonly new: () => BaseNexemaType;

  /**
   * The details of the base type T implements, if any
   */
  readonly inherits: {
    /**
     * The name of the base type.
     */
    readonly name: string;
  } | null;
}
