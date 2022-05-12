/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ExecutionResultDto } from '../models/execution-result-dto';
import { ExecutionResultListDto } from '../models/execution-result-list-dto';

@Injectable({
  providedIn: 'root',
})
export class ExecutionResultService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getExecutionResults
   */
  static readonly GetExecutionResultsPath = '/execution-results/';

  /**
   * Retrieve all execution results for an Implementation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getExecutionResults()` instead.
   *
   * This method doesn't expect any request body.
   */
  getExecutionResults$Response(params?: {
    implId?: string;
  }): Observable<StrictHttpResponse<ExecutionResultListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ExecutionResultService.GetExecutionResultsPath,
      'get'
    );
    if (params) {
      rb.query('implId', params.implId, {});
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
          return r as StrictHttpResponse<ExecutionResultListDto>;
        })
      );
  }

  /**
   * Retrieve all execution results for an Implementation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getExecutionResults$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getExecutionResults(params?: {
    implId?: string;
  }): Observable<ExecutionResultListDto> {
    return this.getExecutionResults$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ExecutionResultListDto>) =>
          r.body as ExecutionResultListDto
      )
    );
  }

  /**
   * Path part for operation getExecutionResult
   */
  static readonly GetExecutionResultPath = '/execution-results/{resultId}';

  /**
   * Retrieve a single execution result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getExecutionResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  getExecutionResult$Response(params: {
    resultId: string;
  }): Observable<StrictHttpResponse<ExecutionResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      ExecutionResultService.GetExecutionResultPath,
      'get'
    );
    if (params) {
      rb.path('resultId', params.resultId, {});
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
          return r as StrictHttpResponse<ExecutionResultDto>;
        })
      );
  }

  /**
   * Retrieve a single execution result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getExecutionResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getExecutionResult(params: {
    resultId: string;
  }): Observable<ExecutionResultDto> {
    return this.getExecutionResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ExecutionResultDto>) =>
          r.body as ExecutionResultDto
      )
    );
  }
}
