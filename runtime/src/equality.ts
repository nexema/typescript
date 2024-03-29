// the following eslint rules are disabled for this file because when calling .equals
// objects will be of the type they indicate, so there is no need for extra checking.

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FieldKind, FieldUtils } from "./definition";
import {
  Primitive,
  PrimitiveList,
  PrimitiveMap,
  PrimitiveMapObj,
} from "./primitives";

export function primitiveEquals(a: Primitive, b: Primitive): boolean {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  // for bigint with number
  return a == b;
}

export function binaryEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    const ua = a[i];
    const ub = b[i];
    if (ua !== ub) {
      return false;
    }
  }

  return true;
}

export function listEquals(
  argumentKind: FieldKind,
  a: PrimitiveList,
  b: PrimitiveList
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  if (FieldUtils.isPrimitive(argumentKind)) {
    for (let i = 0; i < a.length; i++) {
      const left = a[i];
      const right = b[i];

      if (!primitiveEquals(left as Primitive, right as Primitive)) {
        return false;
      }
    }
  } else if (argumentKind === "binary") {
    for (let i = 0; i < a.length; i++) {
      const left = a[i];
      const right = b[i];

      if (!binaryEquals(left as Uint8Array, right as Uint8Array)) {
        return false;
      }
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      const left = a[i];
      const right = b[i];

      if (!(left as any).equals(right)) {
        return false;
      }
    }
  }
  return true;
}

export function mapEquals(
  valueKind: FieldKind,
  a: PrimitiveMap,
  b: PrimitiveMap
): boolean {
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }

    const keys = Array.from(a.keys()).concat(...b.keys());

    if (FieldUtils.isPrimitive(valueKind)) {
      for (const key of keys) {
        const av = a.get(key);
        const bv = b.get(key);

        if (!primitiveEquals(av as Primitive, bv as Primitive)) {
          return false;
        }
      }
    } else if (valueKind === "binary") {
      for (const key of keys) {
        const av = a.get(key);
        const bv = b.get(key);

        if (!binaryEquals(av as Uint8Array, bv as Uint8Array)) {
          return false;
        }
      }
    } else {
      for (const key of keys) {
        const av = a.get(key);
        const bv = b.get(key);

        if (!(av as any).equals(bv)) {
          return false;
        }
      }
    }
  } else {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }

    const keys = new Set(Object.keys(a).concat(Object.keys(b)));

    if (FieldUtils.isPrimitive(valueKind)) {
      for (const key of keys) {
        const av = (a as PrimitiveMapObj)[key];
        const bv = (b as PrimitiveMapObj)[key];

        if (!primitiveEquals(av as Primitive, bv as Primitive)) {
          return false;
        }
      }
    } else if (valueKind === "binary") {
      for (const key of keys) {
        const av = (a as PrimitiveMapObj)[key];
        const bv = (b as PrimitiveMapObj)[key];

        if (!binaryEquals(av as Uint8Array, bv as Uint8Array)) {
          return false;
        }
      }
    } else {
      for (const key of keys) {
        const av = (a as PrimitiveMapObj)[key];
        const bv = (b as PrimitiveMapObj)[key];

        if (!(av as any).equals(bv as any)) {
          return false;
        }
      }
    }
  }

  return true;
}
