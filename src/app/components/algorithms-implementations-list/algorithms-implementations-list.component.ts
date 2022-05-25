import { Component, OnInit } from '@angular/core';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { SdksService } from 'api-nisq/services/sdks.service';
import { SdkDto } from 'api-nisq/models/sdk-dto';
import { Observable } from 'rxjs';
import { UtilService } from '../util/util.service';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';
import { AlgorithmDto, AlgorithmsService } from '../util/algorithms.service';
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
  allAlgorithms: Observable<AlgorithmDto[]>;
  isLoggedIn = false;
  allImpls: ImplementationDto[] = [];

  constructor(
    private nisqImplementationService: ImplementationService,
    private sdkService: SdksService,
    private router: Router,
    private utilService: UtilService,
    private algorithms: AlgorithmsService,
    private planqkPlatformLoginService: PlanqkPlatformLoginService
  ) {}

  ngOnInit(): void {
    this.algorithms.updateAlgorithms();
    this.allAlgorithms = this.algorithms.getAlgorithmList();
    this.planqkPlatformLoginService
      .isLoggedIn()
      .subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn));
  }

  refreshAlgorithms() {
    this.planqkPlatformLoginService
      .isLoggedIn()
      .subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn));
    this.algorithms.updateAlgorithms();
  }

  trackAlgorithmsBy(index, algo: AlgorithmDto) {
    return algo.id;
  }

  trackImplementationsBy(index, impl: ImplementationDto) {
    return impl.id;
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
        this.algorithms.updateAlgorithms();
        this.utilService.callSnackBar(
          'The implementation ' +
            dialogResult.name +
            ' was successfully created.'
        );
      });
  }
}
