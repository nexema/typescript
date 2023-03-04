import { FieldKind, JsKind } from "./definition";
import { JsObj, Primitive, PrimitiveList, PrimitiveMap } from "./primitives";

export function primitiveEquals(kind: FieldKind, a: Primitive, b: Primitive): boolean {
    if(a === b) {
        return true;
    }

    if(!a || !b) {
        return false;
    }

    if(kind === 'binary') {
        if((a as Uint8Array).length !== (b as Uint8Array).length) {
            return false;
        }

        for(let i = 0; i < (a as Uint8Array).length; i++) {
            const ua = (a as Uint8Array)[i];
            const ub = (b as Uint8Array)[i];
            if(ua !== ub) {
                return false;
            }
        }

        return true;
    }

    // for bigint with number
    return a == b;
}

export function listEquals(argumentJsKind: JsKind, argumentKind: FieldKind, a: PrimitiveList, b: PrimitiveList): boolean {
    if(a.length !== b.length) {
        return false;
    }

    switch(argumentJsKind) {
        case 'primitive':
            for(let i = 0; i < a.length; i++) {
                const left = a[i];
                const right = b[i];
        
                if(!primitiveEquals(argumentKind, left as Primitive, right as Primitive)) {
                    return false;
                }
            }

        case 'type':
            for(let i = 0; i < a.length; i++) {
                const left = a[i];
                const right = b[i];
        
                if(!(left as any).equals((right as any))) {
                    return false;
                }
            }
    }
    return true;
}

export function mapEquals(valueJsKind: JsKind, valueKind: FieldKind, a: PrimitiveMap, b: PrimitiveMap): boolean {
    if(a instanceof Map && b instanceof Map) {
        if(a.size !== b.size) {
            return false;
        }

        const keys = Array.from(a.keys()).concat(...b.keys())

        if(valueJsKind === 'primitive') {
            for(const key of keys) {
                const av = a.get(key);
                const bv = b.get(key);
    
                if(!primitiveEquals(valueKind, av as Primitive, bv as Primitive)) {
                    return false;
                } 
            }
        } else if(valueJsKind === 'type') {
            for(const key of keys) {
                const av = a.get(key);
                const bv = b.get(key);
    
                if(!(av as any).equals((bv as any))) {
                    return false;
                }
            }
        }
    } else {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if(aKeys.length !== bKeys.length) {
            return false;
        }

        const keys = new Set(Object.keys(a).concat(Object.keys(b)));

        if(valueJsKind === 'primitive') {
            for(const key of keys) {
                const av = (a as JsObj)[key];
                const bv = (b as JsObj)[key];

                if(!primitiveEquals(valueKind, av as Primitive, bv as Primitive)) {
                    return false;
                }
            }
        } else if(valueJsKind === 'type') {
            for(const key of keys) {
                const av = (a as JsObj)[key];
                const bv = (b as JsObj)[key];

                if(!(av as any).equals((bv as any))) {
                    return false;
                }
            }   
        }
    }
    
    return false;
}