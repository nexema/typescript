/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'

export abstract class Entity<
  T extends $nex.NexemaStruct<T>
> extends $nex.NexemaStruct<Entity<T>> {
  public abstract get id(): string

  public abstract set id(value: string)

  public abstract get createdAt(): Date

  public abstract set createdAt(value: Date)

  public abstract get deletedAt(): Date | null

  public abstract set deletedAt(value: Date | null)

  public abstract get modifiedAt(): Date | null

  public abstract set modifiedAt(value: Date | null)
}
