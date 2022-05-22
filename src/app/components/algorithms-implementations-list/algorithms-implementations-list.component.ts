import { Component, OnInit } from '@angular/core';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { SdksService } from 'api-nisq/services/sdks.service';
import { SdkDto } from 'api-nisq/models/sdk-dto';
import { UtilService } from '../util/util.service';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';
import {
  PlanqkPlatformAlgorithmDto,
  PlanqkPlatformImplementationDto,
  PlanqkPlatformService,
} from '../services/planqk-platform.service';
import {
  AddImplementationDialogComponent,
  DialogData,
} from './dialogs/add-implementation-dialog/add-implementation-dialog.component';

@Component({
  selector: 'app-algorithms-implementations-list',
  templateUrl: './algorithms-implementations-list.component.html',
  styleUrls: ['./algorithms-implementations-list.component.scss'],
})
export class AlgorithmsImplementationsListComponent implements OnInit {
  allAlgorithms = new Map<string, Set<ImplementationDto>>();
  isLoggedIn = false;
  allImpls: ImplementationDto[] = [];

  constructor(
    private nisqImplementationService: ImplementationService,
    private sdkService: SdksService,
    private router: Router,
    private utilService: UtilService,
    private planqkPlatformLoginService: PlanqkPlatformLoginService,
    private planqkPlatformService: PlanqkPlatformService
  ) {}

  ngOnInit(): void {
    this.getAlgorithmsAndImplementations();
  }

  getAlgorithmsAndImplementations(): void {
    this.planqkPlatformLoginService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const planqkImplList: PlanqkPlatformImplementationDto[] = [];
        const planqkAlgoList: PlanqkPlatformAlgorithmDto[] = [];
        this.planqkPlatformService
          .getImplementationsOfPlanqkPlatform()
          .subscribe((plankImpls) => {
            plankImpls.content.map((planqkImpl) =>
              planqkImplList.push(planqkImpl)
            );
            // FIXME
            this.sdkService.getSdks().subscribe((sdks) => {
              planqkImplList.forEach((planqkImpl) => {
                if (planqkImpl.technology) {
                  if (planqkImpl.technology.toLowerCase().includes('qiskit')) {
                    planqkImpl.technology = 'Qiskit';
                  }
                  const availableSdk = sdks.sdkDtos.find(
                    (sdk) =>
                      sdk.name.toLowerCase() ===
                      planqkImpl.technology.toLowerCase()
                  );
                  if (!availableSdk) {
                    const sdkBody: SdkDto = {
                      id: null,
                      name: planqkImpl.technology,
                    };
                    this.sdkService.createSdk({ body: sdkBody }).subscribe();
                  }
                }
              });
            });
            this.planqkPlatformService
              .getAlgorithmsOfPlanqkPlatform()
              .subscribe((planqkAlgos) => {
                planqkAlgos.content.map((planqkAlgo) =>
                  planqkAlgoList.push(planqkAlgo)
                );
                planqkAlgoList.forEach((planqkAlgo) => {
                  planqkImplList.forEach((planqkImpl) => {
                    if (planqkAlgo.id === planqkImpl.implementedAlgorithmId) {
                      const fileIdsList: string[] = [];
                      let fileLocation = '';

                      // TODO: currently file handling is different on the platform than in the QC Atlas. Thus, file access API is
                      // not generated
                      this.planqkPlatformService
                        .getImplementationFileIdOfPlanqkPlatform(
                          planqkImpl.implementedAlgorithmId,
                          planqkImpl.id
                        )
                        .subscribe((files) => {
                          files.content.map((file) =>
                            fileIdsList.push(file.id)
                          );
                          if (fileIdsList.length > 0) {
                            fileLocation =
                              'https://platform.planqk.de/qc-catalog/algorithms/' +
                              planqkImpl.implementedAlgorithmId +
                              '/implementations/' +
                              planqkImpl.id +
                              '/files/' +
                              // TODO: currently assuming first file is the one to be analyzed and executed
                              fileIdsList[0] +
                              '/content';
                            const implDto: ImplementationDto = {
                              id: planqkImpl.id,
                              name: planqkImpl.name,
                              implementedAlgorithm:
                                planqkImpl.implementedAlgorithmId,
                              sdk: planqkImpl.technology,
                              language: planqkImpl.version,
                              fileLocation,
                              selectionRule: '',
                            };
                            if (this.allAlgorithms.has(planqkAlgo.name)) {
                              this.allAlgorithms
                                .get(planqkAlgo.name)
                                .add(implDto);
                            } else {
                              let newSet = new Set<ImplementationDto>();
                              newSet = newSet.add(implDto);
                              this.allAlgorithms.set(planqkAlgo.name, newSet);
                            }
                          }
                        });
                    }
                  });
                });
              });
          });
      } else {
        this.nisqImplementationService
          .getImplementations()
          .subscribe((impls) => {
            this.allImpls = impls.implementationDtos;
            impls.implementationDtos.forEach((impl) => {
              if (impl.algorithmName !== null) {
                if (this.allAlgorithms.has(impl.algorithmName)) {
                  this.allAlgorithms.get(impl.algorithmName).add(impl);
                } else {
                  let newSet = new Set<ImplementationDto>();
                  newSet = newSet.add(impl);
                  this.allAlgorithms.set(impl.algorithmName, newSet);
                }
              }
            });
          });
      }
    });
  }

  onCreateImplementation(): void {
    this.utilService
      .createDialog(AddImplementationDialogComponent, {
        title: 'Add new implementation',
      })
      .afterClosed()
      .subscribe((dialogResult: DialogData) => {
        if (dialogResult) {
          let algoId = uuidv4();
          this.allImpls.forEach((impl) => {
            if (impl.algorithmName === dialogResult.algorithmName) {
              algoId = impl.implementedAlgorithm;
            }
          });
          this.sdkService.getSdks().subscribe((sdks) => {
            const availableSdk = sdks.sdkDtos.find(
              (sdk) => sdk.name === dialogResult.sdk
            );
            if (!availableSdk) {
              const sdkBody: SdkDto = {
                id: null,
                name: dialogResult.sdk,
              };
              this.sdkService
                .createSdk({ body: sdkBody })
                .subscribe(() =>
                  this.createImplementation(dialogResult, algoId)
                );
            } else {
              this.createImplementation(dialogResult, algoId);
            }
          });
        }
      });
  }

  createImplementation(dialogResult: DialogData, algoId: string) {
    const implDto: ImplementationDto = {
      id: null,
      algorithmName: dialogResult.algorithmName,
      implementedAlgorithm: algoId,
      name: dialogResult.name,
      language: dialogResult.language,
      sdk: dialogResult.sdk,
      fileLocation: dialogResult.contentLocation,
      selectionRule: '',
    };
    this.nisqImplementationService
      .createImplementation({
        body: implDto,
      })
      .subscribe(() => {
        this.getAlgorithmsAndImplementations();
        this.utilService.callSnackBar(
          'The implementation ' +
            dialogResult.name +
            ' was successfully created.'
        );
      });
  }

  navigateToImplementation(impl: ImplementationDto): void {
    this.utilService.setImplementationForComponent(impl);
    void this.router.navigate([
      'algorithms',
      impl.implementedAlgorithm,
      'implementations',
      impl.id,
    ]);
  }
}
