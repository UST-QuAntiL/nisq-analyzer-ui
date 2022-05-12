/* tslint:disable */
import { Links } from './links';
import { ParameterListDto } from './parameter-list-dto';
export type ImplementationDto = {
  id?: string;
  name?: string;
  implementedAlgorithm?: string;
  language?: string;
  selectionRule?: string;
  sdk?: string;
  fileLocation?: string;
  inputParameters?: ParameterListDto;
  outputParameters?: ParameterListDto;
  _links?: Links;
};
