/* tslint:disable */
import { Description } from './description';
import { Trapezoidal } from './trapezoidal';
import { Triangular } from './triangular';
export type FuzzyNumber = {
  description?: Description;
  triangular?: Triangular;
  trapezoidal?: Trapezoidal;
};
