/* tslint:disable */
import { CriteriaSet } from './criteria-set';
import { Description } from './description';
export type CriterionValue = {
  description?: Description;
  criterionID?: string;
  criteriaSetID?: string;
  criteriaSet?: CriteriaSet;
  valueOrValues?: Array<{}>;
  id?: string;
  name?: string;
  mcdaConcept?: string;
  mcdaMethod?: string;
};
