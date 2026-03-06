import type { Variable } from 'netcdfjs';

export interface Series {
  name: string;
  dimension: number;
  data: number[] | Array<[number[], number[]]>;
}

export interface GCMSResult {
  times: number[];
  series: Series[];
}

export interface VariableWithValue extends Variable {
  value: Array<string | number | number[]>;
}

export interface NetcdfGcmsResult extends GCMSResult {
  meta: Record<string, string | number>;
  variables: VariableWithValue[];
}
