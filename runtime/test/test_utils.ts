import { NexemaEnum } from "../src/type";

export class EnumA extends NexemaEnum<EnumA> {

    private constructor(index: number, name: string){
        super(index, name);
    }

    public static readonly unknown: EnumA = new EnumA(0, 'unknown');
    public static readonly red: EnumA = new EnumA(1, 'red');
    public static readonly blue: EnumA = new EnumA(2, 'blue');
}