import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanqkPlatformService {
  constructor(private http: HttpClient) {}

  public getImplementationFileIdOfPlanqkPlatform(
    algorithmId: string,
    implementationId: string
  ): Observable<PageFileDto> {
    return this.http
      .get<PageFileDto>(
        'https://platform.planqk.de/qc-catalog/algorithms/' +
          algorithmId +
          '/implementations/' +
          implementationId +
          '/files'
      )
      .pipe(map((files) => files));
  }

  public getImplementationsOfPlanqkPlatform(): Observable<PlanqkPlatformPageImplementationDto> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', 0);
    queryParams = queryParams.append('size', 50);
    return this.http
      .get<PlanqkPlatformPageImplementationDto>(
        'https://platform.planqk.de/qc-catalog/implementations/',
        { params: queryParams }
      )
      .pipe(map((impls) => impls));
  }

  public getAlgorithmsOfPlanqkPlatform(): Observable<PageAlgorithmDto> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', 0);
    queryParams = queryParams.append('size', 50);
    return this.http
      .get<PageAlgorithmDto>(
        'https://platform.planqk.de/qc-catalog/algorithms/',
        { params: queryParams }
      )
      .pipe(map((impls) => impls));
  }
}

export interface PageFileDto {
  totalPages?: number;
  totalElements?: number;
  first?: boolean;
  pageable?: Pageable;
  size?: number;
  content?: FileDto[];
  number?: number;
  sort?: Sort;
  numberOfElements?: number;
  last?: boolean;
  empty?: boolean;
}

export interface FileDto {
  id: string;
  name: string;
  mimeType?: string;
  fileURL?: string;
  creationDate: string;
  lastModifiedAt: string;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface Sort {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}

export interface PageAlgorithmDto {
  totalPages?: number;
  totalElements?: number;
  first?: boolean;
  pageable?: Pageable;
  size?: number;
  content?: AlgortihmDto[];
  number?: number;
  sort?: Sort;
  numberOfElements?: number;
  last?: boolean;
  empty?: boolean;
}

export interface AlgortihmDto {
  id: string;
  name: string;
}

export interface PlanqkPlatformPageImplementationDto {
  totalPages?: number;
  totalElements?: number;
  first?: boolean;
  pageable?: Pageable;
  size?: number;
  content?: PlanqkPlatformImplementationDto[];
  number?: number;
  sort?: Sort;
  numberOfElements?: number;
  last?: boolean;
  empty?: boolean;
}

export interface PlanqkPlatformImplementationDto {
  id: string;
  implementedAlgorithm?: string;
  name: string;
  technology?: string;
  version?: string;
}
