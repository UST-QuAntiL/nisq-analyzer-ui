/* tslint:disable */
import { Links } from './links';
import { McdaResult } from './mcda-result';
export type EntityModelMcdaSensitivityAnalysisJob = {
  id?: string;
  time?: string;
  ready?: boolean;
  method?: string;
  state?: string;
  useBordaCount?: boolean;
  jobId?: string;
  jobType?: 'ANALYSIS' | 'COMPILATION' | 'QPU_SELECTION' | 'MCDA';
  stepSize?: number;
  upperBound?: number;
  lowerBound?: number;
  plotFileLocation?: string;
  originalRanking?: Array<McdaResult>;
  _links?: Links;
};
