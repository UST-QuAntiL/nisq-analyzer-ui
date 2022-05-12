/* tslint:disable */
import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AnalysisResultService } from './services/analysis-result.service';
import { CompilerAnalysisResultService } from './services/compiler-analysis-result.service';
import { ExecutionResultService } from './services/execution-result.service';
import { ImplementationService } from './services/implementation.service';
import { QpuSelectionResultService } from './services/qpu-selection-result.service';
import { RootService } from './services/root.service';
import { SdksService } from './services/sdks.service';
import { XmcdaCriteriaService } from './services/xmcda-criteria.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AnalysisResultService,
    CompilerAnalysisResultService,
    ExecutionResultService,
    ImplementationService,
    QpuSelectionResultService,
    RootService,
    SdksService,
    XmcdaCriteriaService,
    ApiConfiguration,
  ],
})
export class ApiModule {
  static forRoot(
    params: ApiConfigurationParams
  ): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params,
        },
      ],
    };
  }

  constructor(
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error(
        'ApiModule is already loaded. Import in your base AppModule only.'
      );
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
