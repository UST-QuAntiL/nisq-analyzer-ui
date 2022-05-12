/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ImplementationDto } from '../models/implementation-dto';
import { ImplementationListDto } from '../models/implementation-list-dto';
import { ParameterDto } from '../models/parameter-dto';
import { ParameterListDto } from '../models/parameter-list-dto';

@Injectable({
  providedIn: 'root',
})
export class ImplementationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getImplementations
   */
  static readonly GetImplementationsPath = '/implementations/';

  /**
   * Retrieve implementations for an algorithm
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImplementations()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImplementations$Response(params?: {
    algoId?: string;
  }): Observable<StrictHttpResponse<ImplementationListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.GetImplementationsPath,
      'get'
    );
    if (params) {
      rb.query('algoId', params.algoId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ImplementationListDto>;
        })
      );
  }

  /**
   * Retrieve implementations for an algorithm
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getImplementations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImplementations(params?: {
    algoId?: string;
  }): Observable<ImplementationListDto> {
    return this.getImplementations$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ImplementationListDto>) =>
          r.body as ImplementationListDto
      )
    );
  }

  /**
   * Path part for operation createImplementation
   */
  static readonly CreateImplementationPath = '/implementations/';

  /**
   * Create an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createImplementation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImplementation$Response(params: {
    body: ImplementationDto;
  }): Observable<StrictHttpResponse<ImplementationDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.CreateImplementationPath,
      'post'
    );
    if (params) {
      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ImplementationDto>;
        })
      );
  }

  /**
   * Create an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createImplementation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImplementation(params: {
    body: ImplementationDto;
  }): Observable<ImplementationDto> {
    return this.createImplementation$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ImplementationDto>) =>
          r.body as ImplementationDto
      )
    );
  }

  /**
   * Path part for operation getImplementation
   */
  static readonly GetImplementationPath = '/implementations/{implId}';

  /**
   * Retrieve an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImplementation()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImplementation$Response(params: {
    implId: string;
  }): Observable<StrictHttpResponse<ImplementationDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.GetImplementationPath,
      'get'
    );
    if (params) {
      rb.path('implId', params.implId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ImplementationDto>;
        })
      );
  }

  /**
   * Retrieve an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getImplementation$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImplementation(params: { implId: string }): Observable<ImplementationDto> {
    return this.getImplementation$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ImplementationDto>) =>
          r.body as ImplementationDto
      )
    );
  }

  /**
   * Path part for operation updateImplementation
   */
  static readonly UpdateImplementationPath = '/implementations/{implId}';

  /**
   * Update an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateImplementation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateImplementation$Response(params: {
    implId: string;
    body: ImplementationDto;
  }): Observable<StrictHttpResponse<ImplementationDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.UpdateImplementationPath,
      'put'
    );
    if (params) {
      rb.path('implId', params.implId, {});

      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ImplementationDto>;
        })
      );
  }

  /**
   * Update an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateImplementation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateImplementation(params: {
    implId: string;
    body: ImplementationDto;
  }): Observable<ImplementationDto> {
    return this.updateImplementation$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ImplementationDto>) =>
          r.body as ImplementationDto
      )
    );
  }

  /**
   * Path part for operation getInputParameters
   */
  static readonly GetInputParametersPath =
    '/implementations/{implId}/input-parameters';

  /**
   * Retrieve input parameters for an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getInputParameters()` instead.
   *
   * This method doesn't expect any request body.
   */
  getInputParameters$Response(params: {
    implId: string;
  }): Observable<StrictHttpResponse<ParameterListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.GetInputParametersPath,
      'get'
    );
    if (params) {
      rb.path('implId', params.implId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ParameterListDto>;
        })
      );
  }

  /**
   * Retrieve input parameters for an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getInputParameters$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getInputParameters(params: { implId: string }): Observable<ParameterListDto> {
    return this.getInputParameters$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ParameterListDto>) => r.body as ParameterListDto
      )
    );
  }

  /**
   * Path part for operation addInputParameter
   */
  static readonly AddInputParameterPath =
    '/implementations/{implId}/input-parameters';

  /**
   * Add input parameters to an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addInputParameter()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addInputParameter$Response(params: {
    implId: string;
    body: ParameterDto;
  }): Observable<StrictHttpResponse<ParameterDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.AddInputParameterPath,
      'post'
    );
    if (params) {
      rb.path('implId', params.implId, {});

      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ParameterDto>;
        })
      );
  }

  /**
   * Add input parameters to an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addInputParameter$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addInputParameter(params: {
    implId: string;
    body: ParameterDto;
  }): Observable<ParameterDto> {
    return this.addInputParameter$Response(params).pipe(
      map((r: StrictHttpResponse<ParameterDto>) => r.body as ParameterDto)
    );
  }

  /**
   * Path part for operation deleteInputParameters
   */
  static readonly DeleteInputParametersPath =
    '/implementations/{implId}/input-parameters';

  /**
   * Remove input parameters from an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteInputParameters()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteInputParameters$Response(params: {
    implId: string;
    body: Array<string>;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.DeleteInputParametersPath,
      'delete'
    );
    if (params) {
      rb.path('implId', params.implId, {});

      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({
            body: undefined,
          }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Remove input parameters from an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteInputParameters$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteInputParameters(params: {
    implId: string;
    body: Array<string>;
  }): Observable<void> {
    return this.deleteInputParameters$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getOutputParameters
   */
  static readonly GetOutputParametersPath =
    '/implementations/{implId}/output-parameters';

  /**
   * Retrieve output parameters for an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOutputParameters()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOutputParameters$Response(params: {
    implId: string;
  }): Observable<StrictHttpResponse<ParameterListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.GetOutputParametersPath,
      'get'
    );
    if (params) {
      rb.path('implId', params.implId, {});
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ParameterListDto>;
        })
      );
  }

  /**
   * Retrieve output parameters for an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getOutputParameters$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOutputParameters(params: {
    implId: string;
  }): Observable<ParameterListDto> {
    return this.getOutputParameters$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ParameterListDto>) => r.body as ParameterListDto
      )
    );
  }

  /**
   * Path part for operation addOutputParameter
   */
  static readonly AddOutputParameterPath =
    '/implementations/{implId}/output-parameters';

  /**
   * Add output parameters to an implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addOutputParameter()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOutputParameter$Response(params: {
    implId: string;
    body: ParameterDto;
  }): Observable<StrictHttpResponse<ParameterDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ImplementationService.AddOutputParameterPath,
      'post'
    );
    if (params) {
      rb.path('implId', params.implId, {});

      rb.body(params.body, 'application/json');
    }
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/hal+json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ParameterDto>;
        })
      );
  }

  /**
   * Add output parameters to an implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addOutputParameter$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOutputParameter(params: {
    implId: string;
    body: ParameterDto;
  }): Observable<ParameterDto> {
    return this.addOutputParameter$Response(params).pipe(
      map((r: StrictHttpResponse<ParameterDto>) => r.body as ParameterDto)
    );
  }
}
