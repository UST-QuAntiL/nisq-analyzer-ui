/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AnalysisJobDto } from '../models/analysis-job-dto';
import { AnalysisJobListDto } from '../models/analysis-job-list-dto';
import { AnalysisResultDto } from '../models/analysis-result-dto';
import { AnalysisResultListDto } from '../models/analysis-result-list-dto';
import { ExecuteAnalysisResultRequestDto } from '../models/execute-analysis-result-request-dto';
import { ExecutionResultDto } from '../models/execution-result-dto';

@Injectable({
  providedIn: 'root',
})
export class AnalysisResultService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getAnalysisResults
   */
  static readonly GetAnalysisResultsPath =
    '/analysis-results/algorithm/{algoId}';

  /**
   * Retrieve all analysis results for an algorithm
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAnalysisResults()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisResults$Response(params: {
    algoId: string;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<StrictHttpResponse<AnalysisResultListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.GetAnalysisResultsPath,
      'get'
    );
    if (params) {
      rb.path('algoId', params.algoId, {});
      rb.query('sort', params.sort, {});
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
          return r as StrictHttpResponse<AnalysisResultListDto>;
        })
      );
  }

  /**
   * Retrieve all analysis results for an algorithm
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAnalysisResults$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisResults(params: {
    algoId: string;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<AnalysisResultListDto> {
    return this.getAnalysisResults$Response(params).pipe(
      map(
        (r: StrictHttpResponse<AnalysisResultListDto>) =>
          r.body as AnalysisResultListDto
      )
    );
  }

  /**
   * Path part for operation getAnalysisJobs
   */
  static readonly GetAnalysisJobsPath = '/analysis-results/jobs';

  /**
   * Retrieve all compiler analysis jobs
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAnalysisJobs()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJobs$Response(params?: {}): Observable<
    StrictHttpResponse<AnalysisJobListDto>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.GetAnalysisJobsPath,
      'get'
    );
    if (params) {
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
          return r as StrictHttpResponse<AnalysisJobListDto>;
        })
      );
  }

  /**
   * Retrieve all compiler analysis jobs
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAnalysisJobs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJobs(params?: {}): Observable<AnalysisJobListDto> {
    return this.getAnalysisJobs$Response(params).pipe(
      map(
        (r: StrictHttpResponse<AnalysisJobListDto>) =>
          r.body as AnalysisJobListDto
      )
    );
  }

  /**
   * Path part for operation getAnalysisJobsOfAlgorithm
   */
  static readonly GetAnalysisJobsOfAlgorithmPath =
    '/analysis-results/jobs/algorithm/{algoId}';

  /**
   * Retrieve all analysis jobs for an algorithm
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAnalysisJobsOfAlgorithm()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJobsOfAlgorithm$Response(params: {
    algoId: string;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<StrictHttpResponse<AnalysisJobListDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.GetAnalysisJobsOfAlgorithmPath,
      'get'
    );
    if (params) {
      rb.path('algoId', params.algoId, {});
      rb.query('sort', params.sort, {});
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
          return r as StrictHttpResponse<AnalysisJobListDto>;
        })
      );
  }

  /**
   * Retrieve all analysis jobs for an algorithm
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAnalysisJobsOfAlgorithm$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJobsOfAlgorithm(params: {
    algoId: string;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;
  }): Observable<AnalysisJobListDto> {
    return this.getAnalysisJobsOfAlgorithm$Response(params).pipe(
      map(
        (r: StrictHttpResponse<AnalysisJobListDto>) =>
          r.body as AnalysisJobListDto
      )
    );
  }

  /**
   * Path part for operation getAnalysisJob
   */
  static readonly GetAnalysisJobPath = '/analysis-results/jobs/{resId}';

  /**
   * Retrieve a single analysis job result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAnalysisJob()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJob$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<AnalysisJobDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.GetAnalysisJobPath,
      'get'
    );
    if (params) {
      rb.path('resId', params.resId, {});
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
          return r as StrictHttpResponse<AnalysisJobDto>;
        })
      );
  }

  /**
   * Retrieve a single analysis job result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAnalysisJob$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisJob(params: { resId: string }): Observable<AnalysisJobDto> {
    return this.getAnalysisJob$Response(params).pipe(
      map((r: StrictHttpResponse<AnalysisJobDto>) => r.body as AnalysisJobDto)
    );
  }

  /**
   * Path part for operation getAnalysisResult
   */
  static readonly GetAnalysisResultPath = '/analysis-results/{resId}';

  /**
   * Retrieve a single analysis result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAnalysisResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisResult$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<AnalysisResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.GetAnalysisResultPath,
      'get'
    );
    if (params) {
      rb.path('resId', params.resId, {});
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
          return r as StrictHttpResponse<AnalysisResultDto>;
        })
      );
  }

  /**
   * Retrieve a single analysis result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAnalysisResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAnalysisResult(params: { resId: string }): Observable<AnalysisResultDto> {
    return this.getAnalysisResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<AnalysisResultDto>) =>
          r.body as AnalysisResultDto
      )
    );
  }

  /**
   * Path part for operation executeAnalysisResult
   */
  static readonly ExecuteAnalysisResultPath =
    '/analysis-results/{resId}/execute';

  /**
   * Execute an analysis configuration
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `executeAnalysisResult()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  executeAnalysisResult$Response(params: {
    resId: string;
    body?: ExecuteAnalysisResultRequestDto;
  }): Observable<StrictHttpResponse<ExecutionResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      AnalysisResultService.ExecuteAnalysisResultPath,
      'post'
    );
    if (params) {
      rb.path('resId', params.resId, {});

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
          return r as StrictHttpResponse<ExecutionResultDto>;
        })
      );
  }

  /**
   * Execute an analysis configuration
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `executeAnalysisResult$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  executeAnalysisResult(params: {
    resId: string;
    body?: ExecuteAnalysisResultRequestDto;
  }): Observable<ExecutionResultDto> {
    return this.executeAnalysisResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ExecutionResultDto>) =>
          r.body as ExecutionResultDto
      )
    );
  }
}
