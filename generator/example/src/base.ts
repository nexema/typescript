import * as $nex from 'nexema'; 

export abstract class MyBase extends $nex.BaseNexemaType<MyBase> {
  public abstract get stringField(): string;
  public abstract set stringField(value: string);

  public abstract get boolField(): boolean;
  public abstract set boolField(value: boolean);

  public abstract get listField(): Array<number | null>;
  public abstract set listField(value: Array<number | null>);
}
