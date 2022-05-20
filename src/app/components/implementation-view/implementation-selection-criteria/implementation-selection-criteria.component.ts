import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { SdksService } from 'api-nisq/services/sdks.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SdkDto } from 'api-nisq/models/sdk-dto';
import { UtilService } from '../../util/util.service';
import { CreateSdkDialogComponent } from './dialogs/create-sdk-dialog/create-sdk-dialog.component';

@Component({
  selector: 'app-implementation-selection-criteria',
  templateUrl: './implementation-selection-criteria.component.html',
  styleUrls: ['./implementation-selection-criteria.component.scss'],
})
export class ImplementationSelectionCriteriaComponent implements OnInit {
  implId: string;
  nisqImpl: ImplementationDto;
  sdks$: Observable<Option[]>;
  inputChanged = false;
  languages: Option[] = [
    { value: 'Qiskit', label: 'Qiskit' },
    { value: 'OpenQASM', label: 'OpenQASM' },
    { value: 'Quil', label: 'Quil' },
    { value: 'PyQuil', label: 'PyQuil' },
  ];

  constructor(
    private nisqImplementationService: ImplementationService,
    private readonly sdkService: SdksService,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.implId = this.route.snapshot.paramMap.get('implId');
    this.sdks$ = this.sdkService
      .getSdks()
      .pipe(
        map((dto) =>
          dto.sdkDtos.map((sdk) => ({ label: sdk.name, value: sdk.name }))
        )
      );
    this.nisqImplementationService
      .getImplementation({ implId: this.implId })
      .subscribe((impl) => {
        this.nisqImpl = impl;
      });
  }

  implementationChanged(): void {
    this.inputChanged = true;
  }

  saveImplementation(): void {
    this.nisqImplementationService
      .updateImplementation({ implId: this.nisqImpl.id, body: this.nisqImpl })
      .subscribe(() => {
        this.inputChanged = false;
        this.utilService.callSnackBar(
          'The changes on implementation ' +
            this.nisqImpl.name +
            ' were successfully stored.'
        );
      });
  }

  onCreateSoftwarePlatform(): void {
    this.utilService
      .createDialog(CreateSdkDialogComponent, {
        title: 'Add a new SDK',
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          const sdkDto: SdkDto = {
            id: null,
            name: dialogResult.name,
          };
          this.sdkService.createSdk({ body: sdkDto }).subscribe(
            () => {
              this.utilService.callSnackBar(
                'Successfully created SDK "' + dialogResult.name + '".'
              );
              this.sdks$ = this.sdkService.getSdks().pipe(
                map((dto) =>
                  dto.sdkDtos.map((sdk) => ({
                    label: sdk.name,
                    value: sdk.name,
                  }))
                )
              );
            },

            () => {
              this.utilService.callSnackBar(
                'Error! The SDK could not be created in NISQ Analyzer.'
              );
            }
          );
        }
      });
  }
}

export interface Option {
  value: string;
  label: string;
}
