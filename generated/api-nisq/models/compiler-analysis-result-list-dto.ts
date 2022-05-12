/* tslint:disable */
import { CompilerAnalysisResultDto } from './compiler-analysis-result-dto';
import { Links } from './links';
export type CompilerAnalysisResultListDto = {
  compilerAnalysisResultList?: Array<CompilerAnalysisResultDto>;
  _links?: Links;
};
