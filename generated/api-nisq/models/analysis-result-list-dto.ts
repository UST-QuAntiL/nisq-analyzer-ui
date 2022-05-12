/* tslint:disable */
import { AnalysisResultDto } from './analysis-result-dto';
import { Links } from './links';
export type AnalysisResultListDto = {
  analysisResultList?: Array<AnalysisResultDto>;
  _links?: Links;
};
