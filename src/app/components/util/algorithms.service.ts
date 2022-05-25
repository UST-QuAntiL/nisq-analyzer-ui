import { Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  take,
  Subscription,
  map,
  mergeMap,
  toArray,
  from,
} from 'rxjs';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import {
  ImplementationService,
  SdksService,
} from 'generated/api-nisq/services';
import { SdkDto } from 'generated/api-nisq/models';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';
import {
  PlanqkPlatformImplementationDto,
  PlanqkPlatformService,
  AlgortihmDto as PlanqkAlgorithmDto,
} from '../services/planqk-platform.service';

export interface AlgorithmDto {
  name: string;
  id: string;
  implementations: ImplementationDto[];
}

@Injectable({
  providedIn: 'root',
})
export class AlgorithmsService implements OnDestroy {
  private currentImplementationList: ImplementationDto[] = []; // TODO remove?
  private implementationListSubject: BehaviorSubject<ImplementationDto[]> =
    new BehaviorSubject([]);
  private currentAlgorithmList: AlgorithmDto[] = []; // TODO remove?
  private algorithmListSubject: BehaviorSubject<AlgorithmDto[]> =
    new BehaviorSubject([]);

  private implementationListSubscription: Subscription | null = null;
  private algorithmListSubscription: Subscription | null = null;

  constructor(
    private planqkLogin: PlanqkPlatformLoginService,
    private planqkPlatform: PlanqkPlatformService,
    private nisqImplementations: ImplementationService,
    private sdkService: SdksService
  ) {
    this.implementationListSubject
      .asObservable()
      .subscribe((implementations) =>
        this.onImplementationListUpdate(implementations)
      );
    this.algorithmListSubject
      .asObservable()
      .subscribe((algorithms) => this.onAlgorithmListUpdate(algorithms));
  }

  ngOnDestroy(): void {
    this.implementationListSubscription?.unsubscribe();
    this.algorithmListSubscription?.unsubscribe();
    this.implementationListSubject.unsubscribe();
    this.algorithmListSubject.unsubscribe();
  }

  public getImplementationList(): Observable<ImplementationDto[]> {
    return this.implementationListSubject.asObservable();
  }

  public getImplementation(
    implementationId: string
  ): Observable<ImplementationDto> {
    return (
      this.implementationListSubject
        .asObservable()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .pipe(map((impls) => impls.find((i) => i.id === implementationId)))
    );
  }

  public getAlgorithmList(): Observable<AlgorithmDto[]> {
    return this.algorithmListSubject.asObservable();
  }

  public getAlgorithm(algorithmId: string): Observable<AlgorithmDto> {
    return (
      this.algorithmListSubject
        .asObservable()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .pipe(map((algos) => algos.find((a) => a.id === algorithmId)))
    );
  }

  public updateAlgorithms(): void {
    this.planqkLogin.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.fetchPlanqkImplementations();
      } else {
        this.fetchNisqAnalyzerImplementations();
      }
    });
  }

  private onImplementationListUpdate(
    implementations: ImplementationDto[]
  ): void {
    this.currentImplementationList = implementations;

    // helper map
    const algorithms: Map<string, AlgorithmDto> = new Map();

    // bundle implementations to algorithms
    implementations.forEach((impl) => {
      if (impl.algorithmName !== null) {
        const algo = algorithms.get(impl.implementedAlgorithm);
        if (algo != null) {
          algo.implementations.push(impl);
        } else {
          algorithms.set(impl.implementedAlgorithm, {
            name: impl.algorithmName ?? impl.implementedAlgorithm,
            id: impl.implementedAlgorithm,
            implementations: [impl],
          });
        }
      }
    });

    // create a sorted list
    const algorithmList = Array.from(algorithms.values());
    algorithmList.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.algorithmListSubject.next(algorithmList);
  }

  private onAlgorithmListUpdate(algorithms: AlgorithmDto[]): void {
    this.currentAlgorithmList = algorithms;
  }

  private fetchNisqAnalyzerImplementations() {
    this.nisqImplementations
      .getImplementations()
      .pipe(take(1))
      .subscribe((impls) => {
        this.implementationListSubject.next(impls.implementationDtos);
      });
  }

  private mapPlanqImplToAlgorithmImplementation(
    impl: PlanqkPlatformImplementationDto,
    algo: PlanqkAlgorithmDto | null
  ): Observable<ImplementationDto> {
    return this.planqkPlatform
      .getImplementationFileIdOfPlanqkPlatform(
        impl.implementedAlgorithmId,
        impl.id
      )
      .pipe(
        map((files) => {
          const fileIdsList = (files.content ?? []).map((file) => file.id);
          let fileLocation: string = '';
          if (fileIdsList.length > 1) {
            // TODO: currently assuming first file is the one to be analyzed and executed
          }
          if (fileIdsList.length > 0) {
            const algoId: string = impl.implementedAlgorithmId;
            const implId: string = impl.id;
            fileLocation = `https://platform.planqk.de/qc-catalog/algorithms/${algoId}/implementations/${implId}/files/${fileIdsList[0]}/content`;
          }
          const implDto: ImplementationDto = {
            id: impl.id,
            name: impl.name,
            implementedAlgorithm: impl.implementedAlgorithmId,
            algorithmName: algo?.name ?? '',
            sdk: impl.technology,
            language: impl.version,
            fileLocation,
            selectionRule: '',
          };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return implDto;
        })
      );
  }

  private fetchPlanqkImplementations() {
    this.planqkPlatform
      .getImplementationsOfPlanqkPlatform()
      .pipe(
        take(1),
        map((result) => {
          const planqkImplList: PlanqkPlatformImplementationDto[] =
            result.content ?? [];
          planqkImplList.forEach((planqkImpl) => {
            if (planqkImpl.technology?.toLowerCase().includes('qiskit')) {
              planqkImpl.technology = 'Qiskit';
            }
          });
          return planqkImplList;
        }),
        mergeMap((planqkImpls) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          this.sdkService.getSdks().pipe(
            map((sdks) => {
              const available = new Set<string>();
              (sdks.sdkDtos ?? []).forEach((sdk) =>
                available.add(sdk.name.toLowerCase())
              );
              planqkImpls.forEach((impl) => {
                if (
                  !available.has(impl.technology?.toLowerCase() ?? '') &&
                  impl.technology
                ) {
                  const sdkBody: SdkDto = {
                    id: null,
                    name: impl.technology,
                  };
                  this.sdkService.createSdk({ body: sdkBody }).subscribe();
                }
              });

              // return planq impl list as is from closure
              return planqkImpls;
            })
          )
        ),
        mergeMap((planqkImpls) =>
          this.planqkPlatform.getAlgorithmsOfPlanqkPlatform().pipe(
            mergeMap((planqkAlgos) => {
              const algos = planqkAlgos.content ?? [];
              const algoMap = new Map<string, PlanqkAlgorithmDto>();
              algos.forEach((algo) => algoMap.set(algo.id, algo));

              return from(
                planqkImpls.map((impl) =>
                  this.mapPlanqImplToAlgorithmImplementation(
                    impl,
                    algoMap.get(impl.implementedAlgorithmId)
                  )
                )
              );
            })
          )
        ),
        mergeMap((implObservable) => implObservable),
        toArray(),
        take(1)
      )
      .subscribe((implementations) => {
        this.implementationListSubject.next(implementations);
      });
  }
}
