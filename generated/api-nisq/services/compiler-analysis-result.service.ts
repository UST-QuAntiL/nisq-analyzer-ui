/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CompilationJobDto } from '../models/compilation-job-dto';
import { CompilationJobListDto } from '../models/compilation-job-list-dto';
import { CompilerAnalysisResultDto } from '../models/compiler-analysis-result-dto';
import { CompilerAnalysisResultListDto } from '../models/compiler-analysis-result-list-dto';
import { ExecutionResultDto } from '../models/execution-result-dto';

@Injectable({
  providedIn: 'root',
})
export class CompilerAnalysisResultService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getCompilerAnalysisResults
   */
  static readonly GetCompilerAnalysisResultsPath = '/compiler-results/';

  /**
   * Retrieve all compiler analysis results
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompilerAnalysisResults()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisResults$Response(params?: {}): Observable<
    StrictHttpResponse<CompilerAnalysisResultListDto>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      CompilerAnalysisResultService.GetCompilerAnalysisResultsPath,
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
          return r as StrictHttpResponse<CompilerAnalysisResultListDto>;
        })
      );
  }

  /**
   * Retrieve all compiler analysis results
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCompilerAnalysisResults$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisResults(params?: {}): Observable<CompilerAnalysisResultListDto> {
    return this.getCompilerAnalysisResults$Response(params).pipe(
      map(
        (r: StrictHttpResponse<CompilerAnalysisResultListDto>) =>
          r.body as CompilerAnalysisResultListDto
      )
    );
  }

  /**
   * Path part for operation getCompilerAnalysisJobs
   */
  static readonly GetCompilerAnalysisJobsPath = '/compiler-results/jobs';

  /**
   * Retrieve all compiler analysis jobs
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompilerAnalysisJobs()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisJobs$Response(params?: {}): Observable<
    StrictHttpResponse<CompilationJobListDto>
  > {
    const rb = new RequestBuilder(
      this.rootUrl,
      CompilerAnalysisResultService.GetCompilerAnalysisJobsPath,
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
          return r as StrictHttpResponse<CompilationJobListDto>;
        })
      );
  }

  /**
   * Retrieve all compiler analysis jobs
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCompilerAnalysisJobs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisJobs(params?: {}): Observable<CompilationJobListDto> {
    return this.getCompilerAnalysisJobs$Response(params).pipe(
      map(
        (r: StrictHttpResponse<CompilationJobListDto>) =>
          r.body as CompilationJobListDto
      )
    );
  }

  /**
   * Path part for operation getCompilerAnalysisJob
   */
  static readonly GetCompilerAnalysisJobPath = '/compiler-results/jobs/{resId}';

  /**
   * Retrieve a single compilation result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompilerAnalysisJob()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisJob$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<CompilationJobDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      CompilerAnalysisResultService.GetCompilerAnalysisJobPath,
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
          return r as StrictHttpResponse<CompilationJobDto>;
        })
      );
  }

  /**
   * Retrieve a single compilation result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCompilerAnalysisJob$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisJob(params: {
    resId: string;
  }): Observable<CompilationJobDto> {
    return this.getCompilerAnalysisJob$Response(params).pipe(
      map(
        (r: StrictHttpResponse<CompilationJobDto>) =>
          r.body as CompilationJobDto
      )
    );
  }

  /**
   * Path part for operation getCompilerAnalysisResult
   */
  static readonly GetCompilerAnalysisResultPath = '/compiler-results/{resId}';

  /**
   * Retrieve a single compilation result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompilerAnalysisResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisResult$Response(params: {
    resId: string;
  }): Observable<StrictHttpResponse<CompilerAnalysisResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      CompilerAnalysisResultService.GetCompilerAnalysisResultPath,
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
          return r as StrictHttpResponse<CompilerAnalysisResultDto>;
        })
      );
  }

  /**
   * Retrieve a single compilation result
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCompilerAnalysisResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompilerAnalysisResult(params: {
    resId: string;
  }): Observable<CompilerAnalysisResultDto> {
    return this.getCompilerAnalysisResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<CompilerAnalysisResultDto>) =>
          r.body as CompilerAnalysisResultDto
      )
    );
  }

  /**
   * Path part for operation executeCompilationResult
   */
  static readonly ExecuteCompilationResultPath =
    '/compiler-results/{resId}/execute';

  /**
   * Execute a compilation result
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `executeCompilationResult()` instead.
   *
   * This method doesn't expect any request body.
   */
  executeCompilationResult$Response(params: {
    resId: string;
    token: string;
  }): Observable<StrictHttpResponse<ExecutionResultDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      CompilerAnalysisResultService.ExecuteCompilationResultPath,
      'post'
    );
    if (params) {
      rb.path('resId', params.resId, {});
      rb.query('token', params.token, {});
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
   * To access the full response (for headers, for example), `executeCompilationResult$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  executeCompilationResult(params: {
    resId: string;
    token: string;
  }): Observable<ExecutionResultDto> {
    return this.executeCompilationResult$Response(params).pipe(
      map(
        (r: StrictHttpResponse<ExecutionResultDto>) =>
          r.body as ExecutionResultDto
      )
    );
  }
}
