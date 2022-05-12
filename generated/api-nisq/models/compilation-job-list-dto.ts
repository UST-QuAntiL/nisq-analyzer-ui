/* tslint:disable */
import { CompilationJobDto } from './compilation-job-dto';
import { Links } from './links';
export type CompilationJobListDto = {
  compilationJobList?: Array<CompilationJobDto>;
  _links?: Links;
};
