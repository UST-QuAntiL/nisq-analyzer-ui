/* tslint:disable */
import { Description } from './description';
export type Element = {
  description?: Description;
  criterionID: string;
  rankOrValueOrValues?: Array<{
    name?: { namespaceURI?: string; localPart?: string; prefix?: string };
    value?: {};
    nil?: boolean;
    globalScope?: boolean;
    typeSubstituted?: boolean;
  }>;
};
