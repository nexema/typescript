/**
 * BaseNexemaType represents the base class for every generated nexema type
 */
export abstract class BaseNexemaType {

    /**
     * Encodes the current instance ot a Uint8Array
     */
    abstract encode(): Uint8Array;
}

/**
 * NexemaType is the base class for every Nexema struct, union and base types
 */
export abstract class NexemaType extends BaseNexemaType {
    /**
     * Merges the buffer into the current type, overriding any set field.
     * 
     * @param buffer The bufer to merge from.
     */
    abstract mergeFrom(buffer: Uint8Array): void;
}

/**
 * NexemaEnum is the base class for every nexema enum type
 */
export abstract class NexemaEnum extends BaseNexemaType {

}