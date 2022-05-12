/* tslint:disable */
export type Description = {
  title?: string;
  subTitle?: string;
  subSubTitle?: string;
  userOrAuthorOrVersion?: Array<{
    name?: { namespaceURI?: string; localPart?: string; prefix?: string };
    value?: {};
    nil?: boolean;
    globalScope?: boolean;
    typeSubstituted?: boolean;
  }>;
};
