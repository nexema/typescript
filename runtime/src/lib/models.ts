export interface GenerateInput {
    root: string;
    outputPath: string;
    options: {[key: string]:any};
    packages: DeclarationNode;
}

export interface DeclarationNode {
    name: string;
    value: PackageDeclaration | FileDeclaration;
    children: DeclarationNode[];
}

export interface PackageDeclaration {
    packageName: string;
    path: string;
}

export interface FileDeclaration {
    fileName: string;
    path: string;
    id: string;
    types: SchemaTypeDefinition[];
    imports: string[];
}

export type SchemaTypeModifier = 'enum' | 'union' | 'struct';
export interface SchemaTypeDefinition {
    id: string;
    name: string;
    modifier: SchemaTypeModifier;
    fields: TypeFieldDefinition[];
}

export interface TypeFieldDefinition {
    name: string;
    index: number;
    defaultValue: any;
    metadata: {[key: string]:(boolean|number|string)}
    type: SchemaFieldType;
    tsName: string;
}

export type TypePrimitive = 'boolean' | 'string' |'uint8' |'uint16' |'uint32' |'uint64' |'int8' |'int16' |'int32' | 'int64' | 'float32' |'float64' |'custom' |'map' |'list'; 
export interface SchemaFieldType {
    primitive: TypePrimitive;
    typeName?: string;    
    nullable: boolean;
    importId: string;
    typeArguments: SchemaFieldType[];
}