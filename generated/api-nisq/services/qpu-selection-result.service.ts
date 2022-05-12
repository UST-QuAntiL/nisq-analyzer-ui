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
import { QpuSelectionJobDto } from '../models/qpu-selection-job-dto';
import { QpuSelectionJobListDto } from '../models/qpu-selection-job-list-dto';
import { QpuSelectionResultDto } from '../models/qpu-selection-result-dto';
import { QpuSelectionResultListDto } from '../models/qpu-selection-result-list-dto';

@Injectable({
  providedIn: 'root',
})
export class QpuSelectionResultService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getQpuSelectionResults
   */
  static readonly GetQpuSelectionResultsPath = '/qpu-selection-results/';

  /**
   * Retrieve all QPU selection results
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQpuSelectionResults()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionResults$Response(params?: {}): Observable<
    StrictHttpResponse<QpuSelectionResultListDto>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      QpuSelectionResultService.GetQpuSelectionResultsPath,
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
          return r as StrictHttpResponse<QpuSelectionResultListDto>;
        })
      );
  }

  /**
   * Retrieve all QPU selection results
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQpuSelectionResults$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionResults(params?: {}): Observable<QpuSelectionResultListDto> {
    return this.getQpuSelectionResults$Response(params).pipe(
      map(
        (r: StrictHttpResponse<QpuSelectionResultListDto>) =>
          r.body as QpuSelectionResultListDto
      )
    );
  }

  /**
   * Path part for operation getQpuSelectionJobs
   */
  static readonly GetQpuSelectionJobsPath = '/qpu-selection-results/jobs';

  /**
   * Retrieve all QPU selection jobs
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQpuSelectionJobs()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionJobs$Response(params?: {}): Observable<
    StrictHttpResponse<QpuSelectionJobListDto>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      QpuSelectionResultService.GetQpuSelectionJobsPath,
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
          return r as StrictHttpResponse<QpuSelectionJobListDto>;
        })
      );
  }

  /**
   * Retrieve all QPU selection jobs
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQpuSelectionJobs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionJobs(params?: {}): Observable<QpuSelectionJobListDto> {
    return this.getQpuSelectionJobs$Response(params).pipe(
      map(
        (r: StrictHttpResponse<QpuSelectionJobListDto>) =>
          r.body as QpuSelectionJobListDto
      )
    );
  }

  /**
   * Path part for operation getQpuSelectionJob
   */
  static readonly GetQpuSelectionJobPath =
    '/qpu-selection-results/jobs/{resId}';

  /**
   * Retrieve a single QPU selection job
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQpuSelectionJob()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionJob$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<QpuSelectionJobDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      QpuSelectionResultService.GetQpuSelectionJobPath,
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
          return r as StrictHttpResponse<QpuSelectionJobDto>;
        })
      );
  }

  /**
   * Retrieve a single QPU selection job
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQpuSelectionJob$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionJob(params: {
    resId: string;
  }): Observable<QpuSelectionJobDto> {
    return this.getQpuSelectionJob$Response(params).pipe(
      map(
        (r: StrictHttpResponse<QpuSelectionJobDto>) =>
          r.body as QpuSelectionJobDto
      )
    );
  }

  /**
   * Path part for operation getQpuSelectionResult
   */
  static readonly GetQpuSelectionResultPath = '/qpu-selection-results/{resId}';

  /**
   * Retrieve a single QPU selection result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQpuSelectionResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionResult$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<QpuSelectionResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      QpuSelectionResultService.GetQpuSelectionResultPath,
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
          return r as StrictHttpResponse<QpuSelectionResultDto>;
        })
      );
  }

  /**
   * Retrieve a single QPU selection result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQpuSelectionResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQpuSelectionResult(params: {
    resId: string;
  }): Observable<QpuSelectionResultDto> {
    return this.getQpuSelectionResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<QpuSelectionResultDto>) =>
          r.body as QpuSelectionResultDto
      )
    );
  }

  /**
   * Path part for operation executeQpuSelectionResult
   */
  static readonly ExecuteQpuSelectionResultPath =
    '/qpu-selection-results/{resId}/execute';

  /**
   * Execute a compilation result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `executeQpuSelectionResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  executeQpuSelectionResult$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<ExecutionResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      QpuSelectionResultService.ExecuteQpuSelectionResultPath,
      'post'
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
          return r as StrictHttpResponse<ExecutionResultDto>;
        })
      );
  }

  /**
   * Execute a compilation result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `executeQpuSelectionResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  executeQpuSelectionResult(params: {
    resId: string;
  }): Observable<ExecutionResultDto> {
    return this.executeQpuSelectionResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ExecutionResultDto>) =>
          r.body as ExecutionResultDto
      )
    );
  }
}
