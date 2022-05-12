/* tslint:disable */
import { NumericValue } from './numeric-value';
export type Quantitative = {
  preferenceDirection?: 'MIN' | 'MAX';
  minimum?: NumericValue;
  maximum?: NumericValue;
};
