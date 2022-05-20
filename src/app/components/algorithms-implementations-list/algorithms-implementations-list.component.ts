import { Component, OnInit } from '@angular/core';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { UtilService } from '../util/util.service';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';
import {
  PlanqkPlatformImplementationDto,
  PlanqkPlatformService,
} from '../services/planqk-platform.service';
import { AddImplementationDialogComponent } from './dialogs/add-implementation-dialog/add-implementation-dialog.component';

@Component({
  selector: 'app-algorithms-implementations-list',
  templateUrl: './algorithms-implementations-list.component.html',
  styleUrls: ['./algorithms-implementations-list.component.scss'],
})
export class AlgorithmsImplementationsListComponent implements OnInit {
  allImpls: ImplementationDto[] = [];
  allAlgorithms = new Set<string>();

  constructor(
    private nisqImplementationService: ImplementationService,
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
      if (isLoggedIn) {
        // get all algorithms
        // store in all algorithms
        // get for each their names
        // get impls

        const planqkImplList: PlanqkPlatformImplementationDto[] = [];
        this.planqkPlatformService
          .getImplementationsOfPlanqkPlatform()
          .subscribe((plankImpls) => {
            plankImpls.content.map((planqkImpl) =>
              planqkImplList.push(planqkImpl)
            );
            console.log(planqkImplList);
            planqkImplList.forEach((planqkImpl) => {
              // if (
              //   !impls.implementationDtos.find(
              //     (i) => i.name === planqkImpl.name
              //   )
              // ) {
              // wenn nicht in DB dann füge hinzu
              // dabei muss aber noch der Name des Algos rausgefunden werden
              // und schließlich die alle impls speichern
              // AUF DIE DER NUTZER TATSÄCHLICH ZUGRIFF HAT, evtl doch mit Algo anfangen?
              // wie nur die algo/impls anzeigen, in seinem kontext (planqk)
              // }
            });
          });
      } else {
        this.nisqImplementationService
          .getImplementations()
          .subscribe((impls) => {
            this.allImpls = impls.implementationDtos;
            this.allImpls.forEach((impl) => {
              if (impl.algorithmName !== null) {
                this.allAlgorithms.add(impl.algorithmName);
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
      .subscribe((dialogResult) => {
        if (dialogResult) {
          let algoId = uuidv4();
          this.allImpls.forEach((impl) => {
            if (impl.algorithmName === dialogResult.algorithmName) {
              algoId = impl.implementedAlgorithm;
            }
          });

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
      });
  }

  navigateToImplementation(impl: ImplementationDto): void {
    void this.router.navigate(
      ['algorithms', impl.implementedAlgorithm, 'implementations', impl.id],
      { state: impl }
    );
  }
}
