/* tslint:disable */
import { Links } from './links';
import { QpuSelectionResultDto } from './qpu-selection-result-dto';
export type QpuSelectionJobDto = {
  qpuSelectionResultList?: Array<QpuSelectionResultDto>;
  id?: string;
  time?: string;
  circuitName?: string;
  ready?: boolean;
  _links?: Links;
};
