/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { SdkDto } from '../models/sdk-dto';
import { SdkListDto } from '../models/sdk-list-dto';

@Injectable({
  providedIn: 'root',
})
export class SdksService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getSdks
   */
  static readonly GetSdksPath = '/sdks/';

  /**
   * Retrieve all SDKs
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSdks()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSdks$Response(params?: {}): Observable<StrictHttpResponse<SdkListDto>> {
    const rb = new RequestBuilder(this.rootUrl, SdksService.GetSdksPath, 'get');
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
          return r as StrictHttpResponse<SdkListDto>;
        })
      );
  }

  /**
   * Retrieve all SDKs
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSdks$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSdks(params?: {}): Observable<SdkListDto> {
    return this.getSdks$Response(params).pipe(
      map((r: StrictHttpResponse<SdkListDto>) => r.body as SdkListDto)
    );
  }

  /**
   * Path part for operation createSdk
   */
  static readonly CreateSdkPath = '/sdks/';

  /**
   * Creates a new SDK
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createSdk()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createSdk$Response(params: {
    body: SdkDto;
  }): Observable<StrictHttpResponse<SdkDto>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      SdksService.CreateSdkPath,
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
          return r as StrictHttpResponse<SdkDto>;
        })
      );
  }

  /**
   * Creates a new SDK
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createSdk$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createSdk(params: { body: SdkDto }): Observable<SdkDto> {
    return this.createSdk$Response(params).pipe(
      map((r: StrictHttpResponse<SdkDto>) => r.body as SdkDto)
    );
  }

  /**
   * Path part for operation getSdk
   */
  static readonly GetSdkPath = '/sdks/{id}';

  /**
   * Retrieve a single SDK
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSdk()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSdk$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<SdkDto>> {
    const rb = new RequestBuilder(this.rootUrl, SdksService.GetSdkPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
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
          return r as StrictHttpResponse<SdkDto>;
        })
      );
  }

  /**
   * Retrieve a single SDK
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSdk$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSdk(params: { id: string }): Observable<SdkDto> {
    return this.getSdk$Response(params).pipe(
      map((r: StrictHttpResponse<SdkDto>) => r.body as SdkDto)
    );
  }
}
