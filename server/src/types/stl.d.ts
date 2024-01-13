declare module 'stl' {
  type Vertex = [number, number, number];
  type Normal = [number, number, number];

  interface Facet {
    normal?: Normal;
    verts: Vertex[];
    attributeByteCount?: number;
  }

  interface STLObject {
    description: string;
    facets: Facet[];
  }

  interface STLParser {
    createParseStream(): NodeJS.ReadableStream;
    toObject(stl: Buffer | string): STLObject;
    fromObject(obj: STLObject, binary?: boolean): Buffer | string;
    facetNormal(facet: Facet): Normal;
  }

  const stlLibrary: STLParser;
  export = stlLibrary;
}