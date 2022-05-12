/* tslint:disable */
import { Description } from './description';
import { Links } from './links';
import { Scale } from './scale';
export type McdaCriterionDto = {
  id?: string;
  name?: string;
  mcdaConcept?: string;
  active?: boolean;
  description?: Description;
  scale?: Scale;
  _links?: Links;
};
