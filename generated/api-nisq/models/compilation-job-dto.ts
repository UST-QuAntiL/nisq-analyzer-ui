/* tslint:disable */
import { CompilerAnalysisResultDto } from './compiler-analysis-result-dto';
import { Links } from './links';
export type CompilationJobDto = {
  compilerAnalysisResultList?: Array<CompilerAnalysisResultDto>;
  id?: string;
  ready?: boolean;
  _links?: Links;
};
