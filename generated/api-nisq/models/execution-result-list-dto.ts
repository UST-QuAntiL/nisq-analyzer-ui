/* tslint:disable */
import { ExecutionResultDto } from './execution-result-dto';
import { Links } from './links';
export type ExecutionResultListDto = {
  executionResultDtos?: Array<ExecutionResultDto>;
  _links?: Links;
};
