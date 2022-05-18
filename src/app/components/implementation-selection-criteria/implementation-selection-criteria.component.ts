import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { SdksService } from 'api-nisq/services/sdks.service';
import { map } from 'rxjs/operators';
import { Option } from '../generics/property-input/select-input.component';

@Component({
  selector: 'app-implementation-selection-criteria',
  templateUrl: './implementation-selection-criteria.component.html',
  styleUrls: ['./implementation-selection-criteria.component.scss'],
})
export class ImplementationSelectionCriteriaComponent implements OnInit {
  nisqImpl: ImplementationDto;
  oldNisqImpl: ImplementationDto;
  sdks$: Observable<Option[]>;
  languages: Option[] = [
    { value: 'Qiskit', label: 'Qiskit' },
    { value: 'OpenQASM', label: 'OpenQASM' },
    { value: 'Quil', label: 'Quil' },
    { value: 'PyQuil', label: 'PyQuil' },
  ];

  constructor(
    private nisqImplementationService: ImplementationService,
    private readonly sdkService: SdksService
  ) {}

  ngOnInit(): void {
    this.sdks$ = this.sdkService
      .getSdks()
      .pipe(
        map((dto) =>
          dto.sdkDtos.map((sdk) => ({ label: sdk.name, value: sdk.name }))
        )
      );
    // this.nisqImplementationService
    //   .getImplementations({ algoId: this.algo.id })
    //   .subscribe((impls) => {
    //     const foundImpl = impls.implementationDtos.find(
    //       (i) => i.name === this.impl.name
    //     );
    //     if (foundImpl) {
    //       this.nisqImpl = foundImpl;
    //       this.oldNisqImpl = cloneDeep(foundImpl);
    //       this.selection.clear();
    //     } else {
    //       this.createNisqImplementation();
    //     }
    //   });
  }

  saveImplementation(): void {}

  onCreateSoftwarePlatform(): void {}
}
