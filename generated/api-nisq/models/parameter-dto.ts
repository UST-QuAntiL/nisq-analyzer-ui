/* tslint:disable */
export type ParameterDto = {
  name?: string;
  type?:
    | 'Integer'
    | 'Float'
    | 'IntegerArray'
    | 'FloatArray'
    | 'String'
    | 'Unknown';
  restriction?: string;
  description?: string;
};
