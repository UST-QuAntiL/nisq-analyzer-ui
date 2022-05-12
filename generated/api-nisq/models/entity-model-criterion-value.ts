/* tslint:disable */
import { CriteriaSet } from './criteria-set';
import { Description } from './description';
import { Links } from './links';
export type EntityModelCriterionValue = {
  description?: Description;
  criterionID?: string;
  criteriaSetID?: string;
  criteriaSet?: CriteriaSet;
  valueOrValues?: Array<{}>;
  id?: string;
  name?: string;
  mcdaConcept?: string;
  mcdaMethod?: string;
  _links?: Links;
};
