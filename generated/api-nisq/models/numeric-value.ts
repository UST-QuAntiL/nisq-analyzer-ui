/* tslint:disable */
import { Description } from './description';
import { FuzzyLabel } from './fuzzy-label';
import { FuzzyNumber } from './fuzzy-number';
import { Interval } from './interval';
import { RankedLabel } from './ranked-label';
import { Rational } from './rational';
export type NumericValue = {
  description?: Description;
  integer?: number;
  real?: number;
  interval?: Interval;
  rational?: Rational;
  label?: string;
  rankedLabel?: RankedLabel;
  na?: string;
  image?: Array<string>;
  imageRef?: string;
  fuzzyNumber?: FuzzyNumber;
  fuzzyLabel?: FuzzyLabel;
  id?: string;
  name?: string;
  mcdaConcept?: string;
  boolean?: boolean;
};
