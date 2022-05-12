/* tslint:disable */
import { Description } from './description';
import { Nominal } from './nominal';
import { Qualitative } from './qualitative';
import { Quantitative } from './quantitative';
export type Scale = {
  description?: Description;
  valuationType?: 'STANDARD' | 'BIPOLAR';
  nominal?: Nominal;
  qualitative?: Qualitative;
  quantitative?: Quantitative;
  id?: string;
  name?: string;
  mcdaConcept?: string;
};
