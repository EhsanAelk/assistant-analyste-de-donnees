
export interface Column {
  name: string;
  type: string;
  description?: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface DbSchema {
  tables: Table[];
}

export interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-many' | 'many-to-one' | 'one-to-one' | 'many-to-many';
  description: string;
}

export interface KeyVariable {
  table: string;
  column: string;
  reason: string;
}

export interface AnalysisResult {
  summary: string;
  relationships: Relationship[];
  keyVariables: KeyVariable[];
}
