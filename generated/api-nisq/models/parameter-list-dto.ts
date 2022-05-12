/* tslint:disable */
import { Links } from './links';
import { ParameterDto } from './parameter-dto';
export type ParameterListDto = {
  parameters?: Array<ParameterDto>;
  _links?: Links;
};
