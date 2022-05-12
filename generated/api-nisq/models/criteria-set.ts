/* tslint:disable */
import { Description } from './description';
import { Element } from './element';
export type CriteriaSet = {
  description?: Description;
  element?: Array<Element>;
  valueOrValues?: Array<{}>;
  id?: string;
  name?: string;
  mcdaConcept?: string;
};
