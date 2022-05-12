/* tslint:disable */
import { Links } from './links';
import { McdaResult } from './mcda-result';
export type EntityModelMcdaJob = {
  id?: string;
  time?: string;
  ready?: boolean;
  method?: string;
  state?: string;
  useBordaCount?: boolean;
  jobId?: string;
  jobType?: 'ANALYSIS' | 'COMPILATION' | 'QPU_SELECTION' | 'MCDA';
  rankedResults?: Array<McdaResult>;
  _links?: Links;
};
