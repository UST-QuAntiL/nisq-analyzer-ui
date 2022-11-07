import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { exhaustMap, first, map, startWith, switchMap } from 'rxjs/operators';

import { QpuSelectionResultService } from 'api-nisq/services/qpu-selection-result.service';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { QpuSelectionJobDto } from 'api-nisq/models/qpu-selection-job-dto';
import {
  ImplementationDto,
  ImplementationDto as NisqImplementationDto,
} from 'api-nisq/models/implementation-dto';
import {
  CriterionValue,
  EntityModelMcdaJob,
  EntityModelMcdaSensitivityAnalysisJob,
  EntityModelMcdaWeightLearningJob,
  ExecutionResultDto,
  QpuSelectionDto,
  QpuSelectionResultDto,
} from 'api-nisq/models';
import { MatTableDataSource } from '@angular/material/table';
import { RootService } from 'api-nisq/services/root.service';
import { HttpClient } from '@angular/common/http';
import { XmcdaCriteriaService } from 'api-nisq/services/xmcda-criteria.service';
import { UtilService } from '../../util/util.service';
import { PlanqkPlatformLoginService } from '../../services/planqk-platform-login.service';
import { QpuSelectionDialogComponent } from './dialogs/qpu-selection-dialog/qpu-selection-dialog.component';
// eslint-disable-next-line max-len
import { QpuSelectionSensitivityAnalysisDialogComponent } from './dialogs/qpu-selection-sensitivity-analysis-dialog/qpu-selection-sensitivity-analysis-dialog.component';
import { QpuSelectionLearnedWeightsDialogComponent } from './dialogs/qpu-selection-learned-weights-dialog/qpu-selection-learned-weights-dialog.component';
import {
  DialogData,
  QpuSelectionPrioritizationDialogComponent,
} from './dialogs/qpu-selection-prioritization-dialog/qpu-selection-prioritization-dialog.component';
import { QpuSelectionExecutionDialogComponent } from './dialogs/qpu-selection-execution-dialog/qpu-selection-execution-dialog.component';
import { QhanaPluginService } from '../../services/qhana-plugin.service';

@Component({
  selector: 'app-qpu-selection',
  templateUrl: './qpu-selection.component.html',
  styleUrls: ['./qpu-selection.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class QpuSelectionComponent implements OnInit, AfterViewInit {
  @Input() impl: ImplementationDto;
  @ViewChild(MatSort) sort: MatSort;

  analyzeColumns = [
    'rank',
    'score',
    'qpu',
    'provider',
    'compiler',
    'analyzedWidth',
    'analyzedDepth',
    'analyzedMultiQubitGateDepth',
    'analyzedTotalNumberOfOperations',
    'analyzedNumberOfSingleQubitGates',
    'analyzedNumberOfMultiQubitGates',
    'analyzedNumberOfMeasurementOperations',
    'avgSingleQubitGateError',
    'avgMultiQubitGateError',
    'avgSingleQubitGateTime',
    'avgMultiQubitGateTime',
    'avgReadoutError',
    't1',
    't2',
    'lengthQueue',
    'execution',
  ];
  jobColumns = ['time', 'ready'];
  sort$ = new BehaviorSubject<string[] | undefined>(undefined);
  analyzerJobs$: Observable<QpuSelectionJobDto[]>;
  analyzerResults: QpuSelectionResultDto[] = [];
  nisqImpl: NisqImplementationDto;
  analyzerJob: QpuSelectionJobDto;
  jobReady = false;
  pollingAnalysisJobData: Subscription;
  executionResultsAvailable = new Map<string, boolean>();
  loadingResults = new Map<string, boolean>();
  expandedElement: QpuSelectionResultDto | null;
  expandedElementMap: Map<QpuSelectionResultDto, ExecutionResultDto> = new Map<
    QpuSelectionResultDto,
    ExecutionResultDto
  >();
  expandedElementExecResult: ExecutionResultDto | null;
  executedAnalyseResult: QpuSelectionResultDto;
  results?: ExecutionResultDto = undefined;
  // provider?: EntityModelProviderDto;
  // qpu?: EntityModelQpuDto;
  queueLengths = new Map<string, number>();
  qpuDataIsUpToDate = new Map<string, true>();
  qpuCounter = 0;
  qpuCheckFinished = false;
  prioritizationJob: EntityModelMcdaJob;
  prioritizationJobReady = false;
  loadingMCDAJob = false;
  mcdaJobSuccessful = false;
  rankings: Ranking[] = [];
  dataSource = new MatTableDataSource(this.analyzerResults);
  bordaCountEnabled: boolean;
  usedMcdaMethod: string;
  usedLearningMethod: string;
  sensitivityAnalysisJob: EntityModelMcdaSensitivityAnalysisJob;
  sensitivityAnalysisJobReady = false;
  pollingSensitivityAnalysisJobReadyData: Subscription;
  sensitivityAnalysisJobSuccessful = false;
  waitUntilSensitivityAnalysisIsFinished = false;
  sensitivityAnalysisPlot: string;
  loadingLearnWeights = false;
  weightLearningJob: EntityModelMcdaWeightLearningJob;
  learningJobReady: boolean;
  pollingWeightLearningJobData: Subscription;
  learnedWeightsReady = false;
  usedShortWaitingTime: boolean;
  usedStableExecutionResults: boolean;
  userId: string;
  isLoggedIn = false;

  constructor(
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private implementationService: ImplementationService,
    private qpuSelectionService: QpuSelectionResultService,
    private http: HttpClient,
    private nisqAnalyzerRootService: RootService,
    private planqkService: PlanqkPlatformLoginService,
    private mcdaService: XmcdaCriteriaService,
    public qhanaService: QhanaPluginService
  ) {}

  ngOnInit(): void {
    this.planqkService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userId = this.planqkService.getUserSub();
        this.analyzeColumns = [
          'qpu',
          'provider',
          'compiler',
          'analyzedWidth',
          'analyzedDepth',
          'analyzedMultiQubitGateDepth',
          'analyzedTotalNumberOfOperations',
          'analyzedNumberOfSingleQubitGates',
          'analyzedNumberOfMultiQubitGates',
          'analyzedNumberOfMeasurementOperations',
          'avgSingleQubitGateError',
          'avgMultiQubitGateError',
          'avgSingleQubitGateTime',
          'avgMultiQubitGateTime',
          'avgReadoutError',
          't1',
          't2',
          'lengthQueue',
        ];
      } else {
        this.userId = null;
      }
      this.analyzerJobs$ = this.sort$
        .pipe(
          switchMap((sort) =>
            this.qpuSelectionService.getQpuSelectionJobs({
              userId: this.userId,
            })
          )
        )
        .pipe(
          map((dto) =>
            dto.qpuSelectionJobList.filter(
              (analysisJob) => analysisJob.circuitName === this.impl.name
            )
          )
        );
      this.refreshNisqImpl();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onMatSortChange(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property): string | number => {
      switch (property) {
        case 'rank':
          const rankObject = this.rankings.find(
            (value) => value.id === item.id
          );
          return rankObject.rank;
        case 'score':
          const scoreObject = this.rankings.find(
            (value) => value.id === item.id
          );
          return scoreObject.score;
        case 'lengthQueue':
          return this.queueLengths[item.qpu];
        default:
          return item[property];
      }
    };
  }

  onAddAnalysis(): void {
    this.refreshNisqImpl();
    let refreshToken = '';
    this.utilService
      .createDialog(QpuSelectionDialogComponent, {
        title: 'Start QPU-Selection-Analysis',
        isLoggedIn: this.isLoggedIn,
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.analyzerJob = undefined;
          this.jobReady = false;
          refreshToken = this.planqkService.getRefreshToken();
          const providerTokens = {};
          if (dialogResult.token) {
            providerTokens[dialogResult.vendor] = dialogResult.token;
          } else {
            providerTokens[dialogResult.vendor] = ' ';
          }

          const qpuSelectionDto: QpuSelectionDto = {
            simulatorsAllowed: dialogResult.simulatorAllowed,
            allowedProviders: [dialogResult.vendor],
            circuitLanguage: this.nisqImpl.language,
            circuitUrl: this.nisqImpl.fileLocation,
            tokens: providerTokens,
            refreshToken,
            circuitName: this.nisqImpl.name,
            userId: this.userId,
          };
          this.nisqAnalyzerRootService
            .selectQpuForCircuitFile1$Json({
              simulatorsAllowed: dialogResult.simulatorAllowed,
              circuitLanguage: this.nisqImpl.language,
              circuitName: this.nisqImpl.name,
              allowedProviders: [dialogResult.vendor],
              tokens: providerTokens,
              body: qpuSelectionDto,
              compilers: dialogResult.selectedCompilers,
              userId: this.userId,
            })
            .subscribe((job) => {
              this.analyzerJob = job;
              this.jobReady = job.ready;

              this.utilService.callSnackBar(
                'Successfully created analysis job "' + job.id + '".'
              );
              this.ngOnInit();

              this.pollingAnalysisJobData = interval(2000)
                .pipe(
                  startWith(0),
                  switchMap(() =>
                    this.qpuSelectionService.getQpuSelectionJob({
                      resId: this.analyzerJob.id,
                      userId: this.userId,
                    })
                  )
                )
                .subscribe(
                  (jobResult) => {
                    this.analyzerJob = jobResult;
                    this.jobReady = jobResult.ready;
                    if (this.jobReady) {
                      this.ngOnInit();
                      this.analyzerResults = jobResult.qpuSelectionResultList;
                      this.dataSource = new MatTableDataSource(
                        this.analyzerResults
                      );
                      this.pollingAnalysisJobData.unsubscribe();
                    }
                  },
                  () => {
                    this.utilService.callSnackBar(
                      'Error! Could not create analysis job.'
                    );
                  }
                );
            });
        }
      });
  }

  showAnalysisResult(analysisJob: QpuSelectionJobDto): boolean {
    this.qpuSelectionService
      .getQpuSelectionJob({ resId: analysisJob.id, userId: this.userId })
      .subscribe((jobResult) => {
        this.jobReady = jobResult.ready;
        this.analyzerJob = jobResult;
        this.analyzerResults = jobResult.qpuSelectionResultList;
        this.dataSource = new MatTableDataSource(this.analyzerResults);

        for (const analysisResult of this.analyzerResults) {
          this.showBackendQueueSize(analysisResult);
          setInterval(() => this.showBackendQueueSize(analysisResult), 300000);
          this.hasExecutionResult(analysisResult);
          // this.checkIfQpuDataIsOutdated(analysisResult);
        }
      });
    return true;
  }

  execute(analysisResult: QpuSelectionResultDto): void {
    let token = ' ';
    this.utilService
      .createDialog(QpuSelectionExecutionDialogComponent, {
        title: 'Enter your token for the vendor: ' + analysisResult.provider,
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult.token) {
          token = dialogResult.token;
        }
        this.loadingResults[analysisResult.id] = true;
        this.results = undefined;
        this.executedAnalyseResult = analysisResult;
        this.qpuSelectionService
          .executeQpuSelectionResult({
            resId: analysisResult.id,
            token,
          })
          .subscribe(
            (results) => {
              if (
                results.status === 'FAILED' ||
                results.status === 'FINISHED'
              ) {
                this.results = results;
              } else {
                interval(1000)
                  .pipe(
                    exhaustMap(() =>
                      this.http.get<ExecutionResultDto>(
                        results._links['self'].href
                      )
                    ),
                    first(
                      (value) =>
                        value.status === 'FAILED' || value.status === 'FINISHED'
                    )
                  )
                  .subscribe((finalResult) => (this.results = finalResult));
              }
              this.utilService.callSnackBar(
                'Successfully started execution "' + results.id + '".'
              );
              this.hasExecutionResult(analysisResult);
            },
            () => {
              this.utilService.callSnackBar(
                'Error! Could not start execution.'
              );
            }
          );
      });
  }

  hasExecutionResult(analysisResult: QpuSelectionResultDto): void {
    this.qpuSelectionService
      .getQpuSelectionResult({ resId: analysisResult.id, userId: this.userId })
      .subscribe((result) => {
        this.executionResultsAvailable[analysisResult.id] = !!Object.keys(
          result._links
        ).find((key) => key.startsWith('execute-'));
        this.loadingResults[analysisResult.id] = false;
      });
  }

  showExecutionResult(analysisResult: QpuSelectionResultDto): void {
    if (this.expandedElementMap.has(analysisResult)) {
      this.expandedElementMap.delete(analysisResult);
      this.expandedElement = undefined;
      this.expandedElementExecResult = undefined;
      return;
    }
    this.qpuSelectionService
      .getQpuSelectionResult({ resId: analysisResult.id, userId: this.userId })
      .subscribe((result) => {
        const key = Object.keys(result._links).find((k) =>
          k.startsWith('execute-')
        );
        const href = result._links[key].href;
        this.http.get<ExecutionResultDto>(href).subscribe((dto) => {
          this.expandedElement = analysisResult;
          this.expandedElementMap.set(analysisResult, dto);
          this.expandedElementExecResult = dto;
        });
      });
  }

  refreshNisqImpl(): void {
    if (this.qhanaService.isPlugin) {
      this.nisqImpl = this.impl;
    } else {
      this.planqkService.isLoggedIn().subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.nisqImpl = this.impl;
          this.userId = this.planqkService.getUserSub();
        } else {
          this.implementationService
            .getImplementations({ algoId: this.impl.implementedAlgorithm })
            .subscribe((impls) => {
              const foundImpl = impls.implementationDtos.find(
                (i) => i.name === this.impl.name
              );
              this.nisqImpl = foundImpl;
              this.userId = null;
            });
        }
      });
    }
  }

  prioritize(): void {
    this.utilService
      .createDialog(QpuSelectionPrioritizationDialogComponent, {
        title: 'Prioritize Analysis Results',
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.learnedWeightsReady = false;
          this.usedMcdaMethod = dialogResult.mcdaMethod;
          this.usedLearningMethod = dialogResult.weightLearningMethod;
          this.usedShortWaitingTime = dialogResult.shortWaitingTime;
          this.usedStableExecutionResults = dialogResult.stableExecutionResults;
          if (dialogResult.stableExecutionResults) {
            this.loadingLearnWeights = true;
            this.mcdaService
              .learnWeightsForCompiledCircuitsOfJob({
                methodName: this.usedMcdaMethod,
                weightLearningMethod: this.usedLearningMethod,
              })
              .subscribe((job) => {
                this.weightLearningJob = job;
                this.learningJobReady = job.ready;
                this.utilService.callSnackBar(
                  'Successfully started to learn weights.'
                );
                this.pollingWeightLearningJobData = interval(2000)
                  .pipe(
                    startWith(0),
                    switchMap(() =>
                      this.mcdaService.getWeightLearningJob({
                        methodName: this.usedMcdaMethod,
                        weightLearningMethod: this.usedLearningMethod,
                        jobId: this.weightLearningJob.id,
                      })
                    )
                  )
                  .subscribe((jobResult) => {
                    this.weightLearningJob = jobResult;
                    this.learningJobReady = jobResult.ready;
                    if (jobResult.state === 'FINISHED') {
                      this.pollingWeightLearningJobData.unsubscribe();
                      this.loadingLearnWeights = false;
                      this.learnedWeightsReady = true;
                      this.utilService.callSnackBar(
                        'Learned weights are ready.'
                      );
                    } else if (jobResult.state === 'FAILED') {
                      this.pollingWeightLearningJobData.unsubscribe();
                      this.loadingLearnWeights = false;
                      this.learnedWeightsReady = false;
                      this.utilService.callSnackBar(
                        'Error! Could not learn weights.'
                      );
                    }
                  });
              });
          } else {
            this.executePrioritization(dialogResult);
          }
        }
      });
  }

  seeLearnedWeights(): void {
    this.utilService
      .createDialog(QpuSelectionLearnedWeightsDialogComponent, {
        title: 'Learned Weights',
        mcdaMethod: this.usedMcdaMethod,
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.learnedWeightsReady = false;
          this.executePrioritization(dialogResult);
        }
      });
  }

  executePrioritization(dialogResult): void {
    this.loadingMCDAJob = true;
    this.prioritizationJobReady = false;
    let totalSum = 0;
    let criteria = dialogResult.criteriaAndValues;
    this.bordaCountEnabled = !!(
      this.usedStableExecutionResults && this.usedShortWaitingTime
    );
    if (this.usedStableExecutionResults) {
      criteria = dialogResult.criteriaAndValues;
    } else {
      // calculate SMART with new assigned points
      dialogResult.criteriaAndValues.forEach((obj) => {
        totalSum += obj.points;
      });
      dialogResult.criteriaAndValues.forEach((obj) => {
        if (obj.points !== 0) {
          obj.weight = obj.points / totalSum;
        } else {
          obj.weight = 0;
        }
      });
    }
    let numberOfCriterion = 0;
    criteria.forEach((obj) => {
      const criterionValue: CriterionValue = {
        description: { title: 'points', subTitle: obj.points.toString() },
        criterionID: obj.id,
        valueOrValues: [{ real: obj.weight }],
        mcdaMethod: dialogResult.mcdaMethod,
      };
      this.mcdaService
        .updateCriterionValue({
          methodName: dialogResult.mcdaMethod,
          criterionId: obj.id,
          body: criterionValue,
        })
        .subscribe(
          () => {
            numberOfCriterion++;
            if (numberOfCriterion === criteria.length) {
              this.mcdaService
                .prioritizeCompiledCircuitsOfJob({
                  methodName: dialogResult.mcdaMethod,
                  jobId: this.analyzerJob.id,
                  useBordaCount: this.bordaCountEnabled,
                })
                .subscribe((job) => {
                  this.rankings = [];
                  this.prioritizationJob = job;
                  this.prioritizationJobReady = job.ready;
                  this.mcdaJobSuccessful = false;

                  this.utilService.callSnackBar(
                    'Successfully created prioritization job "' + job.id + '".'
                  );
                  this.pollAnalysisJobData(dialogResult);
                });
            }
          },
          () => {
            this.loadingMCDAJob = false;
            this.utilService.callSnackBar(
              'Error! Could not set weight for criteria "' +
                obj.name +
                '". Please try again.'
            );
          }
        );
    });
  }

  pollAnalysisJobData(dialogResult: DialogData): void {
    this.pollingAnalysisJobData = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.mcdaService.getPrioritizationJob({
            methodName: dialogResult.mcdaMethod,
            jobId: this.prioritizationJob.id,
          })
        )
      )
      .subscribe(
        (jobResult) => {
          this.prioritizationJob = jobResult;
          this.prioritizationJobReady = jobResult.ready;
          if (this.prioritizationJobReady) {
            this.loadingMCDAJob = false;
            jobResult.rankedResults.forEach((rankedResult) => {
              this.rankings.push({
                id: rankedResult.resultId,
                rank: rankedResult.position,
                score: rankedResult.score,
              });
            });
            this.analyzerResults.sort((a, b) => {
              const objA = this.rankings.find((value) => value.id === a.id);
              const objB = this.rankings.find((value) => value.id === b.id);
              if (objA.rank < objB.rank) {
                return -1;
              } else {
                return 1;
              }
            });
            this.dataSource = new MatTableDataSource(this.analyzerResults);
            this.mcdaJobSuccessful = true;
            this.pollingAnalysisJobData.unsubscribe();
          }
        },
        () => {
          this.loadingMCDAJob = false;
          this.utilService.callSnackBar(
            'Error! Could not create prioritization job.'
          );
        }
      );
  }

  getRankOfResult(result: QpuSelectionResultDto): number | string {
    const rankingResult = this.rankings.find((value) => value.id === result.id);
    if (rankingResult) {
      return rankingResult.rank;
    } else {
      return '-';
    }
  }

  getScoreOfResult(result: QpuSelectionResultDto): number | string {
    const rankingResult = this.rankings.find((value) => value.id === result.id);
    if (
      rankingResult &&
      this.prioritizationJob.method !== 'electre-III' &&
      !this.bordaCountEnabled
    ) {
      return rankingResult.score;
    } else {
      return '-';
    }
  }

  analyzeSensitivity(): void {
    this.utilService
      .createDialog(QpuSelectionSensitivityAnalysisDialogComponent, {
        title: 'Analyze Sensitivity of Ranking',
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.mcdaService
            .analyzeSensitivityOfCompiledCircuitsOfJob({
              methodName: this.usedMcdaMethod,
              jobId: this.analyzerJob.id,
              stepSize: dialogResult.stepSize,
              upperBound: dialogResult.upperBound,
              lowerBound: dialogResult.lowerBound,
              useBordaCount: this.bordaCountEnabled,
            })
            .subscribe(
              (job) => {
                this.waitUntilSensitivityAnalysisIsFinished = true;
                this.sensitivityAnalysisJobSuccessful = false;
                this.sensitivityAnalysisJob = job;
                this.sensitivityAnalysisJobReady = job.ready;
                this.utilService.callSnackBar(
                  'Successfully created sensitivity analysis job "' +
                    job.id +
                    '".'
                );

                this.pollingSensitivityAnalysisJobReadyData = interval(2000)
                  .pipe(
                    startWith(0),
                    switchMap(() =>
                      this.mcdaService.getSensitivityAnalysisJob({
                        methodName: this.usedMcdaMethod,
                        jobId: job.id,
                      })
                    )
                  )
                  .subscribe((jobResult) => {
                    this.sensitivityAnalysisJob = jobResult;
                    this.sensitivityAnalysisJobReady = jobResult.ready;
                    if (jobResult.state === 'FINISHED') {
                      this.sensitivityAnalysisJobSuccessful = true;
                      this.waitUntilSensitivityAnalysisIsFinished = false;
                      this.sensitivityAnalysisPlot = jobResult.plotFileLocation;
                      this.pollingSensitivityAnalysisJobReadyData.unsubscribe();
                    }
                  });
              },
              () => {
                this.utilService.callSnackBar(
                  'Error! Could not start sensitivity analysis.'
                );
              }
            );
        }
      });
  }

  goToLink(url: string): void {
    window.open(url, '_blank');
  }

  showBackendQueueSize(analysisResult: QpuSelectionResultDto): void {
    this.utilService
      .getIBMQBackendState(analysisResult.qpu)
      .subscribe((data) => {
        this.queueLengths[analysisResult.qpu] = data.lengthQueue;
      });
  }

  saveResultsToQhana() : void {
    const request = new XMLHttpRequest();
    const form = new FormData();
    
    let results = JSON.stringify(this.analyzerResults);
    form.append('results', results);
    
    this.refreshNisqImpl();
    request.addEventListener('load', (event) => {
      this.qhanaService.notifyParentOnSaveResults(this.nisqImpl.fileLocation, event.currentTarget['responseURL'])
    });

    request.open('POST', `${this.qhanaService.pluginURL}/process/`);
    request.send(form);
  }

  //
  // checkIfQpuDataIsOutdated(analysisResult: QpuSelectionResultDto): void {
  //   this.qprovService.getProviders().subscribe((providers) => {
  //     for (const providerDto of providers._embedded.providerDtoes) {
  //       if (
  //         providerDto.name.toLowerCase() ===
  //         analysisResult.provider.toLowerCase()
  //       ) {
  //         this.provider = providerDto;
  //         break;
  //       }
  //     }
  //     // search for QPU with given name from the given provider
  //     this.qprovService
  //       .getQpUs({ providerId: this.provider.id })
  //       .subscribe((qpuResult) => {
  //         for (const qpuDto of qpuResult._embedded.qpuDtoes) {
  //           if (
  //             qpuDto.name.toLowerCase() === analysisResult.qpu.toLowerCase()
  //           ) {
  //             if (
  //               qpuDto.lastCalibrated === null ||
  //               Date.parse(analysisResult.time) >=
  //                 Date.parse(qpuDto.lastCalibrated)
  //             ) {
  //               this.qpuDataIsUpToDate[analysisResult.qpu] = true;
  //             } else {
  //               this.qpuDataIsUpToDate[analysisResult.qpu] = false;
  //             }
  //             break;
  //           }
  //         }
  //         this.qpuCounter++;
  //         if (
  //           this.qpuCounter === this.analyzerJob.qpuSelectionResultList.length
  //         ) {
  //           this.qpuCheckFinished = true;
  //           this.qpuCounter = 0;
  //         } else {
  //           this.qpuCheckFinished = false;
  //         }
  //       });
  //   });
  // }
}

interface Ranking {
  id: string;
  rank: number;
  score: number;
}
