/* tslint:disable */
import { Links } from './links';
export type ExecutionResultDto = {
  id?: string;
  status?: 'INITIALIZED' | 'RUNNING' | 'FAILED' | 'FINISHED';
  statusCode?: string;
  result?: string;
  shots?: number;
  histogramIntersectionValue?: number;
  _links?: Links;
};
