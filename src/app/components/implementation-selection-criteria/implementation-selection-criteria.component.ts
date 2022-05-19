import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { SdksService } from 'api-nisq/services/sdks.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
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
    // this.nisqImplementationService
    //   .getImplementations({ algoId: this.algoId })
    //   .subscribe((impls) => {
    //     const foundImpl = impls.implementationDtos.find(
    //       (i) => i.name === this.nisqImpl.name
    //     );
    //     if (foundImpl) {
    //       this.nisqImpl = foundImpl;
    //       this.oldNisqImpl = cloneDeep(foundImpl);
    //     } else {
    //       this.createNisqImplementation();
    //     }
    //   });
  }

  implementationChanged(): void {
    this.inputChanged = true;
  }

  createNisqImplementation(): void {}

  saveImplementation(): void {
    this.nisqImplementationService
      .updateImplementation({ implId: this.nisqImpl.id, body: this.nisqImpl })
      .subscribe(() => {
        this.inputChanged = false;
      });
  }

  onCreateSoftwarePlatform(): void {}
}

export interface Option {
  value: string;
  label: string;
}
