/* tslint:disable */
import { Description } from './description';
import { FuzzyLabel } from './fuzzy-label';
import { RankedLabel } from './ranked-label';
export type Qualitative = {
  description?: Description;
  preferenceDirection?: 'MIN' | 'MAX';
  rankedLabel?: Array<RankedLabel>;
  fuzzyLabel?: Array<FuzzyLabel>;
};
